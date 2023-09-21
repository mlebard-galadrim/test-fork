import '../utils/FetchUtils';
import { getCurrentLocale } from 'k2/app/I18n';
import * as Sentry from '@sentry/react-native';
import UrlUtils from '../utils/url';
import Config from 'react-native-config';

class ApiClient {
  static API_VERSION = '2.0';

  /**
   * Default headers
   *
   * @type {Object}
   */
  static headers = {
    Accept: `application/x.k2.api+json;v=${ApiClient.API_VERSION}`,
    'Content-Type': 'application/json',
    'X-DEVICE-APP-VERSION': Config.APP_VERSION,
  };

  /**
   * Available API routes
   *
   */
  static ROUTES = {
    clients: '/sync/clients',
    containers: '/sync/containers',
    interventions: '/sync/interventions',
    interventionsPlanned: '/sync/interventions-planned',
    login: '/login',
    refreshToken: '/token/refresh',
    nomenclature: '/nomenclatures',
    userProfile: '/users/profiles/me',
    acceptTerms: '/users/profiles/accept-terms',
    sync: '/sync',
    syncDataErrorReport: '/sync/send-error-report',
    arianeOperation: '/ariane/operation/{barcode}',
    lastKnownBsffsForContainers: '/trackdechets/bsffs/last-known-for-containers',
    getContainerBsffsInfo: '/trackdechets/containers/{uuid}/bsffs-info',
    checkVersion: '/device/check-app-version',
    kits: '/sync/kits',
    analyses: '/sync/analyses',
  };

  static BASE_TIMEOUT = 10 * 1000;
  static TIMEOUTS = {
    login: ApiClient.BASE_TIMEOUT,
    userProfile: ApiClient.BASE_TIMEOUT,
    acceptsTerms: ApiClient.BASE_TIMEOUT,
    refreshToken: ApiClient.BASE_TIMEOUT,
    arianeOperation: 60 * 1000,
    lastKnownBsffsForContainers: ApiClient.BASE_TIMEOUT,
    getContainerBsffsInfo: ApiClient.BASE_TIMEOUT,
    checkVersion: 5 * 1000,
  };

  /**
   * @param {String} host
   */
  constructor(host) {
    this.host = host;

    this.accessToken = null;
    this.refreshToken = null;

    this.setAccessToken = this.setAccessToken.bind(this);
    this.setRefreshToken = this.setRefreshToken.bind(this);

    this.onError = this.onError.bind(this);
  }

  /**
   * Set access token
   *
   * @param {String} token
   */
  setAccessToken(token) {
    console.debug(`Set API Client access token ${token}`);
    this.accessToken = token;
  }

  /**
   * Set refresh token
   *
   * @param {String} token
   */
  setRefreshToken(token) {
    console.debug(`Set API Client refresh token ${token}`);
    this.refreshToken = token;
  }

  /**
   * Get JWT access token by login
   *
   * @param {Object}   credentials
   * @param {Function} success
   * @param {Function} failure
   *
   * @return {Promise}
   */
  login(credentials, success, failure) {
    return new Promise((resolve, reject) => {
      this.call('POST', ApiClient.ROUTES.login, credentials, {}, ApiClient.TIMEOUTS.login).done(result =>
        result.ok ? resolve(result.data) : reject(result.data),
      );
    });
  }

  /**
   * POST check-version: check the app version is up-to-date according to our API.
   */
  checkVersion() {
    const url = ApiClient.ROUTES.checkVersion;

    return new Promise((resolve, reject) => {
      this.call(
        'POST',
        url,
        null,
        {}, // Does not send the auth header to avoid extra issues whenever the token is expired
        ApiClient.TIMEOUTS.refreshToken,
      ).done(result => (result.ok ? resolve(result.data) : reject(result.data)));
    });
  }

  /**
   * Refresh JWT tokens
   *
   * @param {Function} success
   * @param {Function} failure
   *
   * @return {Object}
   */
  refreshTokens(success, failure) {
    this.call(
      'POST',
      ApiClient.ROUTES.refreshToken,
      { refreshToken: this.refreshToken },
      {},
      ApiClient.TIMEOUTS.refreshToken,
    ).then(result => (result.ok ? success(result.data) : failure(result.data)));
  }

  /**
   * Post Interventions/Shippings and any other data created by the app
   *
   * @param {Object}   data
   * @param {Function} success
   * @param {Function} failure
   */
  postSyncData(data, success, failure) {
    this.call('POST', ApiClient.ROUTES.sync, data).done(result =>
      result.ok ? success(result.data) : failure(result.data),
    );
  }

  /**
   * Post Error report
   *
   * @param {Object}   data
   * @param {Function} success
   * @param {Function} failure
   */
  postSyncDataErrorReport(data, success, failure) {
    this.call('POST', ApiClient.ROUTES.syncDataErrorReport, data).done(result =>
      result.ok ? success(result.data) : failure(result.data),
    );
  }

  /**
   * Get client list
   *
   * @param {Function} success
   * @param {Function} failure
   */
  getClients(success, failure) {
    this.call('GET', ApiClient.ROUTES.clients).done(result =>
      result.ok ? success(result.data) : failure(result.data),
    );
  }

  /**
   * Get container list
   *
   * @param {Date|null}   lastSynchronizationDate
   * @param {Number|null} after Cursor (last id)
   *
   * @return {Promise}
   */
  getContainersSlice(lastSynchronizationDate, after) {
    const baseUrl = ApiClient.ROUTES.containers;
    const url = UrlUtils.buildURL(
      baseUrl,
      {},
      {
        since: lastSynchronizationDate?.toISOString() ?? undefined,
        after,
      },
    );

    return new Promise((resolve, reject) => {
      this.call('GET', url).done(result => (result.ok ? resolve(result.data) : reject(result.data)));
    });
  }

  /**
   * @param {String}   barcode
   * @param {Function} success
   * @param {Function} failure
   */
  getArianeOperation(barcode, success, failure) {
    const url = UrlUtils.buildURL(ApiClient.ROUTES.arianeOperation, { barcode });
    this.call('GET', url, null, this.getAuthHeader(), ApiClient.TIMEOUTS.arianeOperation).done(result =>
      result.ok ? success(result.data) : failure(result.data),
    );
  }

  /**
   * Get intervention list
   *
   * @param {Function} success
   * @param {Function} failure
   */
  getInterventions(success, failure) {
    this.call('GET', ApiClient.ROUTES.interventions).done(result =>
      result.ok ? success(result.data) : failure(result.data),
    );
  }

  getKits(success, failure) {
    this.call('GET', ApiClient.ROUTES.kits).done(result => (result.ok ? success(result.data) : failure(result.data)));
  }

  getAnalyses(success, failure) {
    this.call('GET', ApiClient.ROUTES.analyses).done(result =>
      result.ok ? success(result.data) : failure(result.data),
    );
  }

  /**
   * Get a list of last known BSFFs for containers uuids
   *
   * @param {String[]} containersUuids
   * @param {Function} success
   * @param {Function} failure
   */
  getLastKnownBsffsForContainers(containersUuids, success, failure) {
    const url = UrlUtils.buildURL(ApiClient.ROUTES.lastKnownBsffsForContainers, {}, { containersUuids });
    this.call('GET', url, null, this.getAuthHeader(), ApiClient.TIMEOUTS.lastKnownBsffsForContainers).done(result =>
      result.ok ? success(result.data) : failure(result.data),
    );
  }

  /**
   * Get BSFFs info (current, previous, …) for container uuid
   *
   * @param {String}   containersUuid
   * @param {Function} success
   * @param {Function} failure
   */
  getContainerBsffsInfo(containersUuid, success, failure) {
    const url = UrlUtils.buildURL(ApiClient.ROUTES.getContainerBsffsInfo, { uuid: containersUuid });
    this.call('GET', url, null, this.getAuthHeader(), ApiClient.TIMEOUTS.getContainerBsffsInfo).done(result =>
      result.ok ? success(result.data) : failure(result.data),
    );
  }

  /**
   * Get interventions planned list
   *
   * @param {Function} success
   * @param {Function} failure
   *
   * @return {Promise<Array>}
   */
  getInterventionsPlanned() {
    return new Promise((resolve, reject) => {
      this.call('GET', ApiClient.ROUTES.interventionsPlanned).done(result =>
        result.ok ? resolve(result.data) : reject(result.data),
      );
    });
  }

  /**
   * Get current authenticated user profile
   *
   * @param {Function} success
   * @param {Function} failure
   */
  getUserProfile(success, failure) {
    this.call('GET', ApiClient.ROUTES.userProfile, null, this.getAuthHeader(), ApiClient.TIMEOUTS.userProfile).done(
      result => (result.ok ? success(result.data) : failure(result.data)),
    );
  }

  /**
   * Get nomenclature
   *
   * @param {Function} success
   * @param {Function} failure
   */
  getNomenclature(success, failure) {
    this.call('GET', ApiClient.ROUTES.nomenclature).done(result =>
      result.ok ? success(result.data) : failure(result.data),
    );
  }

  /**
   * Accept terms and conditions
   *
   * @param {Function} success
   * @param {Function} failure
   */
  acceptTerms(success, failure) {
    this.call('POST', ApiClient.ROUTES.acceptTerms, null, this.getAuthHeader(), ApiClient.TIMEOUTS.acceptsTerms).done(
      result => (result.ok ? success(result.data) : failure(result.data)),
    );
  }

  /**
   * Get authorization header
   *
   * @return {Object}
   */
  getAuthHeader() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  /**
   * Get language header
   *
   * @return {Object}
   */
  getLanguageHeader() {
    return {
      'Accept-Language': getCurrentLocale(),
    };
  }

  /**
   * Create an HTTP call
   *
   * @param {String}      method
   * @param {String}      path
   * @param {Object|null} data
   * @param {Object}      headers
   * @param {Number|null} timeout (milliseconds)
   *
   * @return {Promise}
   */
  call(method, path, data = null, headers = this.getAuthHeader(), timeout = null) {
    let ok;
    const url = `${this.host}${path}`;

    const controller = new AbortController();

    const params = {
      headers: Object.assign(headers, this.getLanguageHeader(), ApiClient.headers),
      method,
      signal: controller.signal,
    };

    if (data) {
      params.body = JSON.stringify(data);
    }

    console.info('API call:', url, params);

    const fetchPromise = fetch(url, params);

    const configureFetch = fetch =>
      fetch
        .then(response => {
          console.info(`API response ${response.status}:`, url, { response });
          ok = response.ok;

          if (!response.hasBody()) {
            return null;
          }

          const contentType = response.headers.get('Content-Type').toLowerCase().split(';')[0];

          switch (contentType) {
            case 'application/json':
            case 'application/problem+json':
              return response
                .clone()
                .text()
                .then(value => (value.length === 0 ? null : response.json()));

            default:
              return response.text();
          }
        })
        .then(responseData => ({ ok, data: responseData }))
        .catch(error => {
          controller.abort();
          console.warn('Aborting request', { error, timeout });

          return this.onError(error);
        });
    if (!timeout) {
      return configureFetch(fetchPromise);
    }

    return configureFetch(this.fetchWithTimeout(timeout, fetchPromise));
  }

  onError(error) {
    if (!error instanceof TimeoutError) {
      // Don't log timeout errors
      Sentry.captureException(error);
    }

    return { ok: false, data: error };
  }

  /**
   * Timeout function for fetch
   *
   * @param {Number} time (milliseconds)
   * @param {Promise} promise
   *
   * @see https://medium.com/@szantoboldizsar/es6-fetch-with-timeout-and-abort-45476bcf6880
   */
  fetchWithTimeout = (time, promise) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new TimeoutError(time));
      }, time);
      promise.then(resolve, reject);
    });
  };
}

export class TimeoutError extends Error {
  constructor(timeout, message = `Request exceeded timeout of ${timeout}ms`) {
    super(message);
    this.name = 'TimeoutError';
    this.timeout = timeout;
  }
}

/**
 * An API response error with its content
 */
export class ApiError extends Error {
  constructor(message = 'API error response', content) {
    let extra = '';
    if (content.status) {
      const serialized = JSON.stringify({
        title: content.title,
        detail: content.detail,
      });

      extra = `: Got a ${content.status} response. ${serialized})`;
    }

    super(message + extra);

    this.name = 'ApiError';
    this.content = content;
  }
}

export default ApiClient;
