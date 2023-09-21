import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { TopBar } from "../../components/generic/top-bar.component";
import { TermsOfServiceStep } from "../../components/register/terms-of-use.component";

export const RegisterTosScreen = () => {
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
          value: 3 / 7,
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      <TermsOfServiceStep />
    </View>
  );
};
