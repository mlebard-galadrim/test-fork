import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import styled from "styled-components";
import { useLogin } from "../../../hooks/useLogin";
import colors from "../../../themes/colors.theme";
import { DarkButton } from "../../generic/buttons/dark-button.component";
import { LightButton } from "../../generic/buttons/light-button.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

const Container = styled(View)`
  margin-left: 8px;
  margin-right: 8px;
  background-color: ${colors.dark};
  align-items: center;
  text-align: center;
  padding: 10px 8px 10px 8px;
`;

const DoubleButtonView = styled(View)`
  margin-top: 24px;
  flex-direction: row;
`;

const SingleButtonView = styled(View)`
  margin-top: 24px;
  flex-direction: row;
  width: 60%;
`;

export const LogSuggestion = (props) => {
  const navigation = useNavigation();
  const { logged } = useLogin();
  const onCreateAccount = () => {
    navigation.navigate("RegisterNavigator");
  };
  const onLogin = () => {
    navigation.navigate("LoginScreen");
  };
  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };
  return (
    <Container>
      <Text style={{ paddingHorizontal: 30, textAlign: "center" }}>
        <GoldBrokerText ssp fontSize={17} i18nKey="leftMenu.connectOrCreateAccount.body" />
      </Text>
      {!logged ? (
        <DoubleButtonView>
          <LightButton flex i18nKey="account.createAccount" onPress={onCreateAccount} />
          <DarkButton flex i18nKey="account.login" onPress={onLogin} />
        </DoubleButtonView>
      ) : (
        <SingleButtonView>
          <DarkButton flex i18nKey="account.myProfile" onPress={navigateToProfile} />
        </SingleButtonView>
      )}
    </Container>
  );
};
