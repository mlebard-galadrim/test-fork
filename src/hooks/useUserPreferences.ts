import { useSelector } from "react-redux";
import { updateUserPreferences } from "../services/users.service";
import { State, Store } from "../store/configure.store";
import AppSlice from "../store/slices/app.slice";
import PreferencesSlice from "../store/slices/preferences.slice";
import { useLogin } from "./useLogin";

export const useUserPreferences = () => {
  const { timezone, locale } = useSelector((state: State) => state.appStore);
  const { currency, storageFeePeriod, subscribedToInAppNewsletter } = useSelector((state: State) => state.preferencesStore);
  const { logged } = useLogin();

  const handleCurrencyChange = (currencyData) => {
    Store.dispatch(PreferencesSlice.actions.setCurrency(currencyData));
    if (logged) {
      void updateUserPreferences({
        timezone: timezone,
        currency: currencyData,
        locale: locale,
        storageFeePeriod: storageFeePeriod ? 1 : 0,
        subscribedToInAppNewsletter: subscribedToInAppNewsletter ? 1 : 0,
      });
    }
  };

  function handleLocaleChange(localeData) {
    Store.dispatch(AppSlice.actions.setLocale(localeData));
    if (logged) {
      void updateUserPreferences({
        locale: localeData,
        timezone: timezone,
        storageFeePeriod: storageFeePeriod ? 1 : 0,
        subscribedToInAppNewsletter: subscribedToInAppNewsletter ? 1 : 0,
        currency: currency,
      });
    }
  }

  function handleSubscribedToInAppNewsletterChange(subscribedToInAppNewsletterData) {
    Store.dispatch(PreferencesSlice.actions.setSubscribedToInAppNewsletter(subscribedToInAppNewsletterData));
    if (logged) {
      void updateUserPreferences({
        locale: locale,
        timezone: timezone,
        storageFeePeriod: storageFeePeriod ? 1 : 0,
        subscribedToInAppNewsletter: subscribedToInAppNewsletterData ? 1 : 0,
        currency: currency,
      });
    }
  }

  return {
    timezone,
    currency,
    locale,
    storageFeePeriod,
    subscribedToInAppNewsletter,
    handleCurrencyChange,
    handleLocaleChange,
    handleSubscribedToInAppNewsletterChange,
  };
};
