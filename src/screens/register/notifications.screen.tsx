import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { TopBar } from "../../components/generic/top-bar.component";
import { NotificationStep } from "../../components/register/notifications.component";

export const RegisterNotificationScreen = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            navigation.goBack();
          },
        }}
        middle={{
          type: "progressbar",
          value: 4 / 7,
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      <NotificationStep />
    </View>
  );
};
