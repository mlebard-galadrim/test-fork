import { Store } from "../store/configure.store";
import AppSlice from "../store/slices/app.slice";
import AuthSlice from "../store/slices/auth.slice";
import PreferencesSlice from "../store/slices/preferences.slice";
import UserSlice from "../store/slices/user.slice";
import { getProfileInfo, getUserPreferences } from "./../services/users.service";

export const logout = () => {
  Store.dispatch(AuthSlice.actions.reset());
  Store.dispatch(PreferencesSlice.actions.reset());
};

export const loadProfileInfo = () => {
  getProfileInfo().then((r) => {
    Store.dispatch(UserSlice.actions.setFirstname(r.firstname));
    Store.dispatch(UserSlice.actions.setLastname(r.lastname));
    Store.dispatch(UserSlice.actions.setBalances(r.balances));
    Store.dispatch(UserSlice.actions.setPicture(r.picture));
    Store.dispatch(UserSlice.actions.setUserId(r.id));
    Store.dispatch(UserSlice.actions.setLegalStatus(r.legal_status));
    Store.dispatch(UserSlice.actions.setAddressStatus(r.address_status));
    Store.dispatch(UserSlice.actions.setBankAccountStatus(r.bank_account_status));
    Store.dispatch(UserSlice.actions.setIdentityStatus(r.identity_status));
    Store.dispatch(UserSlice.actions.setCurrency(r.currency));
  });
  getUserPreferences().then((r) => {
    Store.dispatch(PreferencesSlice.actions.setMetalsNewsletter(r.newsletter_subscription));
    Store.dispatch(AppSlice.actions.setLocale(r.locale));
    Store.dispatch(PreferencesSlice.actions.setCurrency(r.currency));
    Store.dispatch(PreferencesSlice.actions.setStorageFeePeriod(r.storage_fee_period));
    Store.dispatch(PreferencesSlice.actions.setSubscribedToInAppNewsletter(r.subscribed_to_in_app_newsletter));
  });
};
