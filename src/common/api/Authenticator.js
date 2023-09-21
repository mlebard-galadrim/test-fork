import AsyncStorage from '@react-native-community/async-storage';
import * as Sentry from '@sentry/react-native';

class Authenticator {
  static STORAGE_ACCESS_TOKEN = 'accessToken';
  static STORAGE_REFRESH_TOKEN = 'refreshToken';

  static STORAGE_PROFILE = 'userProfile';

  static STORAGE_SYNC = 'lastSynchronization';

  /**
   * @param {ApiClient} api
   */
  constructor(api) {
    this.api = api;
  }

  /**
   * Fetch login API
   *
   * @param {Object}   credentials
   * @param {Function} callback
   */
  async login(credentials, callback) {
    try {
      const data = await this.api.login(credentials);
      this.onSuccessLogin(data, callback);
    } catch (error) {
      this.onFailureLogin(error, callback);
    }
  }

  /**
   * Success login response
   *
   * @param {Object}   data
   * @param {Function} callback
   */
  onSuccessLogin(data, callback) {
    const { token, refreshToken } = data;

    this.createAccessToken(token);
    this.createRefreshToken(refreshToken);

    callback(token);
  }

  /**
   * Failure login response
   *
   * @param {Object|Error} data Response error content or Error instance
   * @param {Function} callback
   */
  onFailureLogin(data, callback) {
    const payload = data instanceof Error ? { error: data } : { errorCode: data.code };

    callback(null, payload);
  }

  /**
   * Refresh auth tokens
   *
   * @param {Function} callback
   */
  refreshTokens(callback) {
    this.api.refreshTokens(
      data => this.onSuccessRefreshTokens(data, callback),
      data => this.onFailureRefreshTokens(data, callback),
    );
  }

  /**
   * Success refresh tokens response
   *
   * @param {Object}   data
   * @param {Function} callback
   */
  onSuccessRefreshTokens(data, callback) {
    const { token, refreshToken } = data;

    this.createAccessToken(token);
    this.createRefreshToken(refreshToken);

    callback(token);
  }

  /**
   * Failure refresh tokens response
   *
   * @param {Object|Error} data Response error content or Error instance
   * @param {Function} callback
   */
  onFailureRefreshTokens(data, callback) {
    const payload = data instanceof Error ? { error: data } : { errorCode: data.code };

    callback(null, payload);
  }

  /**
   * Create and store the access token
   *
   * @param {String} token
   */
  createAccessToken(token) {
    AsyncStorage.setItem(Authenticator.STORAGE_ACCESS_TOKEN, token).done();

    this.api.setAccessToken(token);
  }

  /**
   * Create and store the refresh token
   *
   * @param {String} token
   */
  createRefreshToken(token) {
    AsyncStorage.setItem(Authenticator.STORAGE_REFRESH_TOKEN, token).done();

    this.api.setRefreshToken(token);
  }

  /**
   * Get access token
   *
   * @return {Promise}
   */
  getAccessToken() {
    const promise = AsyncStorage.getItem(Authenticator.STORAGE_ACCESS_TOKEN);

    promise.done(this.api.setAccessToken);

    return promise;
  }

  /**
   * Get refresh token
   *
   * @return {Promise}
   */
  getRefreshToken() {
    const promise = AsyncStorage.getItem(Authenticator.STORAGE_REFRESH_TOKEN);

    promise.done(this.api.setRefreshToken);

    return promise;
  }

  /**
   * Remove stored tokens
   */
  resetTokens() {
    AsyncStorage.removeItem(Authenticator.STORAGE_ACCESS_TOKEN);
    AsyncStorage.removeItem(Authenticator.STORAGE_REFRESH_TOKEN);

    this.api.setAccessToken(null);
    this.api.setRefreshToken(null);
  }

  /**
   * Fetch user profile
   *
   * @param {Function} callback
   * @param {Boolean} force Force refresh
   */
  getUserProfile(callback, force = false) {
    AsyncStorage.getItem(Authenticator.STORAGE_PROFILE).done(profile => {
      if (profile && !force) {
        this.onSuccessGetUserProfile(JSON.parse(profile), callback);

        return;
      }

      this.api.getUserProfile(
        data => this.onSuccessGetUserProfile(data, callback),
        data => this.onFailureGetUserProfile(data, callback),
      );
    });
  }

  /**
   * Accept terms and conditions
   *
   * @param {Function} callback
   */
  acceptTerms(callback) {
    this.api.acceptTerms(
      data => this.onSuccessGetUserProfile(data, callback),
      data => this.onFailureGetUserProfile(data, callback),
    );
  }

  /**
   * Success user profile response
   *
   * @param {Object}   data
   * @param {Function} callback
   */
  onSuccessGetUserProfile(data, callback) {
    this.saveProfile(data);
    Sentry.setUser({ userID: data.uuid, email: data.email });
    callback(data);
  }

  /**
   * Failure user profile response
   *
   * @param {Object|Error} data Response error content or Error instance
   * @param {Function} callback
   */
  onFailureGetUserProfile(data, callback) {
    Sentry.setUser({ userID: null, email: null });

    const payload = data instanceof Error ? { error: data } : { errorCode: data.code };

    callback(null, payload);
  }

  /**
   * Create and store the profile
   *
   * @param {Object} profile
   */
  saveProfile(profile) {
    AsyncStorage.setItem(Authenticator.STORAGE_PROFILE, JSON.stringify(profile));
  }

  /**
   * Remove stored profile
   */
  resetProfile() {
    AsyncStorage.removeItem(Authenticator.STORAGE_PROFILE);
  }

  /**
   * Get the last synchronization date
   *
   * @param {Function} callback
   */
  getLastSynchronization(callback) {
    AsyncStorage.getItem(Authenticator.STORAGE_SYNC).done(value => this.onGetLastSynchronization(value, callback));
  }

  /**
   * Last synchronization has been retrieved
   *
   * @param {Number|null} value Last synchronization date as a timestamp.
   * @param {Function} callback
   */
  onGetLastSynchronization(value, callback) {
    const date = value ? parseInt(value, 10) : null;
    this.setLastSynchronization(date);
    callback(date);
  }

  /**
   * Set and store the last synchronization date
   *
   * @param {Number} date Last synchronization date as a timestamp.
   */
  setLastSynchronization(date = Date.now()) {
    if (date) {
      AsyncStorage.setItem(Authenticator.STORAGE_SYNC, JSON.stringify(date));
    } else {
      AsyncStorage.removeItem(Authenticator.STORAGE_SYNC);
    }
  }

  /**
   * Reset the last synchronization date
   */
  resetLastSynchronization() {
    AsyncStorage.removeItem(Authenticator.STORAGE_SYNC);
  }
}

export default Authenticator;
