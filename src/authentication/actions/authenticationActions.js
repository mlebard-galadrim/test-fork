import { getVersion } from 'k2/app/modules/authentication/utils/RealmUtils';
import {
  ACCEPT_TERMS_FAIL,
  ACCEPT_TERMS_SUCCESS,
  CHANGE_LANGUAGE,
  GET_USER_PROFILE_FAIL,
  GET_USER_PROFILE_SUCCESS,
  LOGIN,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REALM_SCHEMA_VERSION,
  REFRESH_TOKEN,
  REFRESH_TOKEN_FAIL,
  REFRESH_TOKEN_SUCCESS,
  SYNCHRONIZE,
  SYNCHRONIZE_FAIL,
  SYNCHRONIZE_SKIP,
  SYNCHRONIZE_SUCCESS,
  UPDATE_LOCAL_MODIFICATIONS_COUNT,
  UPDATE_PLANNED_INTERVENTIONS_REMAINING,
} from 'k2/app/modules/authentication/constants';
import { updateTranslation } from 'k2/app/I18n';
import { get } from 'k2/app/container';
import syncActions, { addSentryBreadcrumb } from 'k2/app/modules/common/actions/syncActions';
import * as Sentry from '@sentry/react-native';

function hydrateUserProfile(userProfile) {
  return userProfile;
}

/**
 * @param {String} username
 * @param {String} password
 */
export function login(username, password) {
  return dispatch => {
    dispatch({ type: LOGIN });

    return new Promise(async (resolve, reject) => {
      await get('authenticator').login({ username, password }, (token, { error, errorCode } = {}) => {
        if (token) {
          dispatch({ type: LOGIN_SUCCESS });
          resolve(token);
        } else {
          dispatch({ type: LOGIN_FAIL, payload: { error, errorCode } });
          reject({ error, errorCode });
        }
      });
    });
  };
}

export function refreshAuthTokens() {
  return dispatch => {
    const sentryDefaultBreadcrumb = {
      category: 'auth',
      data: { action: 'refreshAuthTokens' },
      level: Sentry.Severity.Info,
    };

    return new Promise((resolve, reject) => {
      get('firebase-analytics').logEvent('auth_refresh_tokens');
      Sentry.addBreadcrumb({
        ...sentryDefaultBreadcrumb,
        message: 'Refresh auth tokens...',
      });

      dispatch({ type: REFRESH_TOKEN });

      get('authenticator').refreshTokens((token, { error, errorCode } = {}) => {
        if (token) {
          Sentry.addBreadcrumb({
            ...sentryDefaultBreadcrumb,
            message: 'Refresh auth tokens done',
          });

          dispatch({ type: REFRESH_TOKEN_SUCCESS });
          resolve(token);

          return;
        }

        get('firebase-analytics').logEvent('auth_refresh_tokens_failed');
        Sentry.addBreadcrumb({
          ...sentryDefaultBreadcrumb,
          data: { action: 'refreshAuthTokens' },
          level: Sentry.Severity.Error,
        });

        dispatch({ type: REFRESH_TOKEN_FAIL, payload: { error, errorCode } });
        reject(new RefreshTokenError({ error, errorCode }));
      });
    });
  };
}

/**
 * Get user profile action
 *
 * @param {Boolean} force Force refresh
 */
export function getUserProfile(force = false) {
  return dispatch => {
    get('authenticator').getUserProfile((userProfile, { error, errorCode } = {}) => {
      if (userProfile) {
        dispatch({
          type: GET_USER_PROFILE_SUCCESS,
          payload: { userProfile: hydrateUserProfile(userProfile) },
        });
      } else {
        dispatch({ type: GET_USER_PROFILE_FAIL, payload: { error, errorCode } });
      }
    }, force);
  };
}

/**
 * Accept terms and conditions
 */
export function acceptTerms() {
  return dispatch => {
    get('authenticator').acceptTerms((userProfile, { error, errorCode } = {}) => {
      if (userProfile) {
        dispatch({
          type: ACCEPT_TERMS_SUCCESS,
          payload: { userProfile: hydrateUserProfile(userProfile) },
        });
      } else {
        dispatch({ type: ACCEPT_TERMS_FAIL, payload: { error, errorCode } });
      }
    });
  };
}

/**
 * Auth access at launch
 */
export function authAccess() {
  return async dispatch => {
    const token = await get('authenticator').getAccessToken();
    await get('authenticator').getRefreshToken();

    if (token) {
      dispatch({ type: LOGIN_SUCCESS });
    } else {
      dispatch({ type: LOGIN_FAIL });
    }
  };
}

/**
 * Updates the number of interventions count
 */
export function updateLocalModificationCount() {
  return dispatch => {
    const interventionRepository = get('intervention_repository');
    const interventionReportRepository = get('intervention_report_repository');
    const shippingRepository = get('shipping_repository');
    const clientRepository = get('client_repository');
    const siteRepository = get('site_repository');
    const installationRepository = get('installation_repository');
    const containerRepository = get('container_repository');
    const transferRepository = get('transfer_repository');
    const analysisRepository = get('analysis_repository');

    const count =
      interventionRepository.findUnsynced().length +
      interventionRepository.findUpdated().length +
      interventionReportRepository.findUnsynced().length +
      shippingRepository.findUnsynced().length +
      clientRepository.findUnsynced().length +
      siteRepository.findUnsynced().length +
      installationRepository.findUnsynced().length +
      containerRepository.findUnsynced().length +
      containerRepository.findUpdated().length +
      transferRepository.findUnsynced().length +
      analysisRepository.findUnsynced().length;

    dispatch({ type: UPDATE_LOCAL_MODIFICATIONS_COUNT, payload: { count } });
    dispatch(updatePlannedInterventionsRemaining());
  };
}

export function updatePlannedInterventionsRemaining() {
  return dispatch => {
    const plannedInterventionsRemaining = get('intervention_planned_repository').findAll().length > 0;

    dispatch({ type: UPDATE_PLANNED_INTERVENTIONS_REMAINING, payload: { plannedInterventionsRemaining } });
  };
}

/**
 * Synchronize the user's data
 */
export function synchronize(ignoreLastSyncDate) {
  return dispatch => {
    const sync = (lastSyncDate = null) =>
      get('synchronizer').synchronize(
        // Success
        () => {
          const date = Date.now();
          get('authenticator').setLastSynchronization(date);
          dispatch({ type: SYNCHRONIZE_SUCCESS, payload: { date } });
          dispatch(getUserProfile(true));
          dispatch(updateLocalModificationCount());
          get('firebase-analytics').logEvent('sync_success');
          addSentryBreadcrumb(Sentry.Severity.Info, 'Synchronize succeeded', 'synchronize');
        },
        // Failure
        error => {
          dispatch({
            type: SYNCHRONIZE_FAIL,
            payload: { errorCode: error.message || 'sync-fail' },
          });
          get('firebase-analytics').logEvent('sync_failure');
          addSentryBreadcrumb(Sentry.Severity.Error, 'Synchronize failed', 'synchronize');
        },
        // Since last sync date if provided:
        lastSyncDate ? new Date(lastSyncDate) : null,
      );

    get('firebase-analytics').logEvent('synchronize');
    addSentryBreadcrumb(Sentry.Severity.Info, 'Synchronizing...', 'synchronize');
    dispatch(syncActions.reset());

    dispatch(refreshAuthTokens())
      .then(() => {
        dispatch({ type: SYNCHRONIZE });
        ignoreLastSyncDate ? sync() : get('authenticator').getLastSynchronization(sync);
      })
      .catch(e => {
        console.warn(e.message, { e });

        if (
          // If it's a refresh token error and not a 401 (refresh token expired), capture:
          (e instanceof RefreshTokenError && (e.error || e.errorCode !== 401)) ||
          // Capture any other errors:
          !e instanceof RefreshTokenError
        ) {
          console.debug('Logging error to Sentry');
          Sentry.captureException(e);
        }
      });
  };
}

/**
 * Get schema version action
 */
export function getSchemaVersion() {
  return dispatch => {
    get('realm');
    dispatch({
      type: REALM_SCHEMA_VERSION,
      payload: { schemaVersion: getVersion() },
    });
  };
}

/**
 * Get last synchronization action (launch synchronization if needed)
 */
export function getLastSynchronization() {
  return (dispatch, getState) => {
    if (getState().device.offline) {
      dispatch({ type: SYNCHRONIZE_SKIP });

      return;
    }

    if (getState().authentication.schemaUpdated) {
      // On schema update, force a full sync:
      synchronize(true)(dispatch);

      return;
    }

    get('authenticator').getLastSynchronization(date => {
      if (get('synchronizer').isFresh(date)) {
        console.info('Already synchronized!');

        dispatch({ type: SYNCHRONIZE_SUCCESS, payload: { date } });
        dispatch(updateLocalModificationCount());
      } else {
        synchronize()(dispatch);
      }
    });
  };
}

/**
 * Logout action
 */
export function logout() {
  return dispatch => {
    const authenticator = get('authenticator');

    authenticator.resetTokens();
    authenticator.resetProfile();
    authenticator.resetLastSynchronization();

    dispatch({ type: LOGOUT });
  };
}

/**
 * Update lang content
 *
 * @param {String} lang
 */
export function changeLanguage(lang) {
  return dispatch => {
    updateTranslation(lang);

    dispatch({ type: CHANGE_LANGUAGE, payload: { lang } });
  };
}

export class RefreshTokenError extends Error {
  constructor({ error = null, errorCode = null }) {
    if (error instanceof Error) {
      super(`Refresh token error: ${error.message}`);
    } else {
      super('Refresh token error');
    }

    this.name = 'RefreshTokenError';
    this.error = error;
    this.errorCode = errorCode;
  }
}
