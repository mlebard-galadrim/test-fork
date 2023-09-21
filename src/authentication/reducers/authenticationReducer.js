import I18n from 'i18n-js';
import { getVersion } from '../utils/RealmUtils';
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAIL,
  LOGOUT,
  REALM_SCHEMA_VERSION,
  GET_USER_PROFILE_SUCCESS,
  GET_USER_PROFILE_FAIL,
  ACCEPT_TERMS_SUCCESS,
  ACCEPT_TERMS_FAIL,
  SYNCHRONIZE,
  SYNCHRONIZE_SUCCESS,
  SYNCHRONIZE_FAIL,
  SYNCHRONIZE_SKIP,
  UPDATE_LOCAL_MODIFICATIONS_COUNT,
  CHANGE_LANGUAGE,
  REFRESH_TOKEN,
  UPDATE_PLANNED_INTERVENTIONS_REMAINING,
} from '../constants';
import syncActions from '../../common/actions/syncActions';

const refreshTokenInitialState = {
  refreshTokens: false,
  refreshTokensSucceeded: null,
  refreshTokensError: null,
  refreshTokensErrorCode: null,
};

const initialState = {
  logged: null,
  error: null,
  errorCode: null,
  userProfile: null,
  synchronizing: false,
  lastSynchronization: null,
  schemaVersion: getVersion(),
  schemaUpdated: false,
  /** Nb of modifications made locally that are not yet synchronized with the server. */
  localModificationsCount: 0,
  lang: I18n.currentLocale().slice(0, 2),
  plannedInterventionsRemaining: false,
  ...refreshTokenInitialState,
};

/**
 * Authentication reducer
 *
 * @param {Object} state
 * @param {Object} action
 *
 * @return {Object}
 */
export default function authentication(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case LOGIN:
      return {
        ...state,
        logged: false,
        userProfile: null,
        error: null,
        errorCode: null,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        logged: true,
        userProfile: null,
        error: null,
        errorCode: null,
      };

    case LOGIN_FAIL:
    case GET_USER_PROFILE_FAIL:
      return {
        ...state,
        logged: false,
        error: payload ? payload.error : null,
        errorCode: payload ? payload.errorCode : null,
        userProfile: null,
      };

    case REFRESH_TOKEN:
      return {
        ...state,
        ...refreshTokenInitialState,
        refreshTokens: true,
      };

    case REFRESH_TOKEN_SUCCESS:
      return {
        ...state,
        ...refreshTokenInitialState,
        refreshTokens: false,
        refreshTokensSucceeded: true,
      };

    case REFRESH_TOKEN_FAIL:
      return {
        ...state,
        refreshTokens: false,
        refreshTokensSucceeded: false,
        refreshTokensError: payload ? payload.error : null,
        refreshTokensErrorCode: payload ? payload.errorCode : null,
      };

    case GET_USER_PROFILE_SUCCESS:
      return {
        ...state,
        error: null,
        errorCode: null,
        userProfile: payload.userProfile,
      };

    case ACCEPT_TERMS_SUCCESS:
      return {
        ...state,
        error: null,
        errorCode: null,
        userProfile: { ...state.userProfile, termsAccepted: true },
      };

    case ACCEPT_TERMS_FAIL:
      return {
        ...state,
        error: payload ? payload.error : null,
        errorCode: payload ? payload.errorCode : null,
        userProfile: { ...state.userProfile, termsAccepted: false },
      };

    case syncActions.RESET:
      return {
        ...state,
        synchronizing: false,
        error: null,
        errorCode: null,
      };

    case SYNCHRONIZE:
      return {
        ...state,
        synchronizing: true,
        error: null,
        errorCode: null,
      };

    case SYNCHRONIZE_SUCCESS:
      return {
        ...state,
        lastSynchronization: payload.date,
        schemaUpdated: false,
        synchronizing: false,
        error: null,
        errorCode: null,
      };

    case SYNCHRONIZE_SKIP:
      return {
        ...state,
        lastSynchronization: undefined,
        schemaUpdated: false,
        synchronizing: false,
        error: null,
        errorCode: null,
      };

    case SYNCHRONIZE_FAIL:
      return {
        ...state,
        synchronizing: false,
        error: null,
        errorCode: payload ? payload.errorCode : null,
      };

    case LOGOUT:
      return {
        ...initialState,
        logged: false,
      };

    case REALM_SCHEMA_VERSION:
      return {
        ...state,
        schemaVersion: payload.schemaVersion,
        schemaUpdated: state.schemaVersion !== payload.schemaVersion,
      };

    case UPDATE_LOCAL_MODIFICATIONS_COUNT:
      return {
        ...state,
        localModificationsCount: payload.count,
      };

    case CHANGE_LANGUAGE:
      return {
        ...state,
        lang: payload.lang,
      };

    case UPDATE_PLANNED_INTERVENTIONS_REMAINING: {
      return {
        ...state,
        plannedInterventionsRemaining: payload.plannedInterventionsRemaining,
      };
    }
    default:
      return state;
  }
}
