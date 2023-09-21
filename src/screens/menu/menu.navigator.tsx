import { AboutScreen } from "./about/about.screen";
import { CguScreen } from "./cgu/cgu.screen";
import { ClientReviewScreen } from "./client-review/client-review.screen";
import MenuScreen from "./menu.screen";
import NewsletterNavigator from "./newsletter/newsletter.navigator";
import React from "react";
import ServiceScreen from "./our-services/service.screen";
import { ServicesScreen } from "./our-services/services.screen";
import SettingsNavigator from "./settings/settings.navigator";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function MenuNavigator() {
  let initialRouteName = "MenuScreen";

  return (
    <Stack.Navigator headerMode="none" initialRouteName={initialRouteName}>
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      <Stack.Screen
        name="NewsletterNavigator"
        component={NewsletterNavigator}
      />
      <Stack.Screen name="ServicesScreen" component={ServicesScreen} />
      <Stack.Screen name="ClientReviewScreen" component={ClientReviewScreen} />
      <Stack.Screen name="CguScreen" component={CguScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
      <Stack.Screen name="SettingsNavigator" component={SettingsNavigator} />
      <Stack.Screen name="ServiceScreen" component={ServiceScreen} />
    </Stack.Navigator>
  );
}
