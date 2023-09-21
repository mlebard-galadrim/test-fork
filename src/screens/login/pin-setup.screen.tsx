import React from "react";
import styled from "styled-components";
import { TopBar } from "../../components/generic/top-bar.component";
import { PinInitiate } from "../../components/login/pin-initiate.component";

const Container = styled.View`
  flex: 1;
`;

export const PinSetup = ({ route, navigation }) => {
  const { token, refresh_token } = route.params;
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
      <PinInitiate {...{ token, refresh_token }} />
    </Container>
  );
};
