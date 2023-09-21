import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import { PinUpdateForm } from "../../../../../components/profile/pinUpdate/pin-update-form.component";

const Container = styled(View)`
  flex: 1;
  align-items: center;
`;

export const PinUpdateScreen = () => {
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
          title: "profile.menu.pin_change",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
        mb={10}
      />
      <PinUpdateForm />
    </Container>
  );
};
