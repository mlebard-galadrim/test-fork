import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { ContactScreen } from "./contact-us.screen";

const Stack = createStackNavigator();

export default function ContactNavigator() {
  let initialRouteName = "ContactScreen";

  return (
    <Stack.Navigator headerMode="none" initialRouteName={initialRouteName}>
      <Stack.Screen name="ContactScreen" component={ContactScreen} />
    </Stack.Navigator>
  );
}
