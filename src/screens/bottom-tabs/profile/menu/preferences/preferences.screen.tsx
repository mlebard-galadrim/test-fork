import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import { DropdownSetting } from "../../../../../components/profile/preferences/dropdown-setting.component";
import { UsePreferences } from "./usePreferences";

export const PreferencesScreen = () => {
  const navigation = useNavigation();

  const {
    currencies,
    currency,
    locales,
    locale,
    timezones,
    timezone,
    handleLocaleChange,
    handleCurrencyChange,
    handleTimeZoneChange,
  } = UsePreferences();
  return (
    <View>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            navigation.goBack();
          },
        }}
        middle={{
          type: "text",
          title: "profile.menu.preferences",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      {timezone ? (
        <DropdownSetting
          title={"Fuseau horaire"}
          choices={timezones.filter((t) => t !== timezone).map((t) => t.label)}
          choice={timezone.label}
          setChoice={handleTimeZoneChange}
        />
      ) : null}
      {currency ? (
        <DropdownSetting
          title={"Devise"}
          choices={currencies.filter((c) => c !== currency).map((c) => c.name)}
          choice={currency.name}
          setChoice={handleCurrencyChange}
        />
      ) : null}
      {locale ? (
        <DropdownSetting
          title={"Langue"}
          choices={locales.filter((l) => l !== locale).map((l) => l.original_name)}
          choice={locale.original_name}
          setChoice={handleLocaleChange}
        />
      ) : null}
    </View>
  );
};
