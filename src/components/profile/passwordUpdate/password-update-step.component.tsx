import { Image, View } from "react-native";

import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { GoldbrokerInput } from "../../style/goldbroker-input.component";
import React from "react";
import styled from "styled-components";

const passwordIcon = require("../../../../assets/icons/login/icons-password.png");

const Container = styled(View)`
  width: 100%;
  align-items: center;
`;

const FormContainer = styled(View)`
  width: 100%;
  padding: 0px 50px;
  margin-top: 16px;
  margin-bottom: 30px;
`;

export const PasswordUpdateStep = ({
  password,
  setPassword,
  instruction,
  detail = "",
}) => {
  return (
    <Container>
      <Image source={passwordIcon} style={{ marginBottom: 17 }} />
      <GoldBrokerText i18nKey={instruction} ssp fontSize={17} />
      <FormContainer>
        <GoldbrokerInput
          secret
          value={password}
          padding={0}
          radius={4}
          placeholder={"●●●●●●●●"}
          mb={16}
          onChange={setPassword}
        />
        <GoldBrokerText i18nKey={detail} gray fontSize={12} ssp />
      </FormContainer>
    </Container>
  );
};
