import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { TopBar } from "../../components/generic/top-bar.component";
import { FormStep } from "../../components/register/form.component";
import { Store } from "../../store/configure.store";
import RegisterSlice from "../../store/slices/register.slice";

export const RegisterFormScreen = () => {
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
            Store.dispatch(RegisterSlice.actions.reset());
            navigation.goBack();
          },
        }}
        middle={{
          type: "progressbar",
          value: 1 / 7,
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      <FormStep />
    </View>
  );
};
