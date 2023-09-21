import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { CurrencyScreen } from "./currency.screen";
import { LanguageScreen } from "./language.screen";
import { NotificationsScreen } from "./notifications.screen";
import { SettingsScreen } from "./settings.screen";

const Stack = createStackNavigator();

export default function SettingsNavigator() {
  let initialRouteName = "SettingsScreen";

  return (
    <Stack.Navigator headerMode="none" initialRouteName={initialRouteName}>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
      <Stack.Screen name="CurrencyScreen" component={CurrencyScreen} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
    </Stack.Navigator>
  );
}
