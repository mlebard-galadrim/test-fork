import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import { PasswordUpdateForm } from "../../../../../components/profile/passwordUpdate/password-update-form";

const Container = styled(View)`
  flex: 1;
  align-items: center;
`;

export const PasswordUpdateScreen = () => {
  const navigation = useNavigation();
  return (
    <Container>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
        }}
        middle={{
          type: "text",
          title: "profile.passwordUpdate.title",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      <PasswordUpdateForm />
    </Container>
  );
};
