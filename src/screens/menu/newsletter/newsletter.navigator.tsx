import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { NewsletterSuccessScreen } from "./newsletter-succes.screen";
import { NewsletterScreen } from "./newsletter.screen";

const Stack = createStackNavigator();

export default function NewsletterNavigator({ options }) {
  let initialRouteName = "NewsletterScreen";
  return (
    <Stack.Navigator headerMode="none" initialRouteName={initialRouteName}>
      <Stack.Screen name="NewsletterScreen" component={NewsletterScreen} />
      <Stack.Screen
        name="NewsletterSuccessScreen"
        component={NewsletterSuccessScreen}
      />
    </Stack.Navigator>
  );
}
