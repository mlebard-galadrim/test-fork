import ClientType from 'k2/app/modules/installation/models/ClientType';
import { get } from 'k2/app/container';

class Security {
  /**
   * @param {Store} store The redux store handling the application state.
   */
  constructor(store) {
    this.store = store;
  }

  /**
   * @return {Object|null}
   */
  getUserProfile() {
    const state = this.store.getState();

    if (!state.authentication || !state.authentication.userProfile) {
      return null;
    }

    return state.authentication.userProfile;
  }

  /**
   * @return {Boolean}
   */
  isCompanyUser() {
    return this.getUserClient().type === ClientType.COMPANY;
  }

  /**
   * @returns {Client} The current user client
   */
  getUserClient() {
    const profile = this.getUserProfile();

    if (!profile) {
      throw new Error('User profile not available');
    }

    return get('client_repository').find(profile.clientUuid);
  }
}

export default Security;
