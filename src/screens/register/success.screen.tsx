import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { TopBar } from "../../components/generic/top-bar.component";
import { SuccessRegisterStep } from "../../components/register/success.component";

export const RegisterSuccessScreen = () => {
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
            navigation.navigate("RegisterFormScreen");
          },
        }}
        middle={{
          type: "progressbar",
          value: 7 / 7,
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      <SuccessRegisterStep />
    </View>
  );
};
