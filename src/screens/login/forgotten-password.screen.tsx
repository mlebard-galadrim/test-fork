import { useNavigation } from "@react-navigation/native";
import React from "react";
import styled from "styled-components";
import { TopBar } from "../../components/generic/top-bar.component";
import { ForgottenPasswordForm } from "../../components/login/forgotten-password-form.component";

const Container = styled.View`
  flex: 1;
`;

export const ForgottenPasswordScreen = () => {
  const navigation = useNavigation();
  return (
    <Container>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      <ForgottenPasswordForm />
    </Container>
  );
};
