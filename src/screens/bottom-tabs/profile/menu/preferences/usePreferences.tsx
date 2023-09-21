import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import AppSlice from "../../../../../store/slices/app.slice";
import PreferencesSlice from "../../../../../store/slices/preferences.slice";
import { State } from "../../../../../store/configure.store";
import { timezones } from "../../../../../constants/timezone";

export const UsePreferences = () => {
  const dispatch = useDispatch();
  const currencyCode = useSelector(
    (state: State) => state.preferencesStore.currency
  );
  const currencies = useSelector((state: State) => state.dataStore.currencies);
  const [currency, setCurrency] = useState(null);
  const locales = useSelector((state: State) => state.dataStore.locales);
  const localeCode = useSelector((state: State) => state.appStore.locale);
  const [locale, setLocale] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const tzCode = useSelector((state: State) => state.appStore.timezone);

  useEffect(() => {
    setCurrency(currencies.filter((c) => c.code === currencyCode)[0]);
  }, [currencyCode]);

  useEffect(() => {
    setTimezone(timezones.filter((t) => t.tzCode === tzCode)[0] ?? "Undefined");
  }, [tzCode]);

  useEffect(() => {
    setLocale(locales.filter((l) => l.code === localeCode)[0]);
  }, [localeCode]);

  const handleCurrencyChange = (currencyName: string) => {
    const tempCurrency = currencies.filter((c) => c.name === currencyName)[0];
    dispatch(PreferencesSlice.actions.setCurrency(tempCurrency.code));
  };

  const handleLocaleChange = (localeName: string) => {
    const locale = locales.filter((l) => l.original_name === localeName)[0];
    dispatch(AppSlice.actions.setLocale(locale.code));
  };

  const handleTimeZoneChange = (timezoneLabel: string) => {
    const timezone = timezones.filter((t) => t.label === timezoneLabel)[0];
    dispatch(AppSlice.actions.setTimeZone(timezone.tzCode));
  };

  return {
    currencies,
    currency,
    locales,
    locale,
    handleLocaleChange,
    handleCurrencyChange,
    handleTimeZoneChange,
    timezones,
    timezone,
  };
};
