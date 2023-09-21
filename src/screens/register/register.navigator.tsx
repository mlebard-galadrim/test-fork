import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { CguScreen } from "../menu/cgu/cgu.screen";
import { RegisterFormScreen } from "./form.screen";
import { RegisterNewsletterScreen } from "./newsletter.screen";
import { RegisterNotificationScreen } from "./notifications.screen";
import { RegisterPinScreen } from "./pin.screen";
import { RegisterSuccessScreen } from "./success.screen";
import { RegisterTosScreen } from "./tos.screen";

const Stack = createStackNavigator();

export default function RegisterNavigator() {
  let initialRouteName = "RegisterFormScreen";

  return (
    <Stack.Navigator headerMode="none" initialRouteName={initialRouteName}>
      <Stack.Screen name="RegisterFormScreen" component={RegisterFormScreen} />
      <Stack.Screen name="RegisterTosScreen" component={RegisterTosScreen} />
      <Stack.Screen name="RegisterNotificationScreen" component={RegisterNotificationScreen} />
      <Stack.Screen name="RegisterNewsletterScreen" component={RegisterNewsletterScreen} />
      <Stack.Screen name="RegisterPinScreen" component={RegisterPinScreen} />
      <Stack.Screen name="RegisterSuccessScreen" component={RegisterSuccessScreen} />
      <Stack.Screen name="CguScreen" component={CguScreen} />
    </Stack.Navigator>
  );
}
