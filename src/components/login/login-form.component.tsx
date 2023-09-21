import { useNavigation } from "@react-navigation/native";
import i18n from "i18n-js";
import React, { useEffect } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import colors from "../../themes/colors.theme";
import { validateEmail } from "../../utils/regex.util";
import { NextStepButton } from "../generic/buttons/next-step-button.component";
import { GoldbrokerInput } from "../style/goldbroker-input.component";
import { GoldBrokerText } from "../style/goldbroker-text.component";
import { UseLoginForm } from "./useLoginForm";

const Container = styled(View)`
  flex: 1;
  align-items: center;
`;

const FormContainer = styled(View)`
  width: 100%;
  padding: 0px 50px;
  margin-top: 16px;
  margin-bottom: 50px;
`;

const loginIcon = require("../../../assets/icons/login/icons-user.png");

export const LoginForm = () => {
  const { mail, setMail, password, setPassword, stepCompleted, setStepCompleted, errorMessage, handleNextStepPress } = UseLoginForm();

  const navigation = useNavigation();
  useEffect(() => {
    setStepCompleted(validateEmail(mail));
  }, [mail]);

  return (
    <Container>
      <Image source={loginIcon} style={{ marginBottom: 17 }} />
      <GoldBrokerText i18nKey="profile.login.form.instruction" ssp fontSize={17} mb={36} />
      <FormContainer>
        <GoldbrokerInput value={mail} padding={0} radius={4} placeholder={i18n.t("profile.login.form.mail_placeholder")} mb={16} onChange={setMail} />
        <GoldbrokerInput
          value={password}
          padding={0}
          radius={4}
          placeholder={i18n.t("profile.login.form.password_placeholder")}
          onChange={setPassword}
          secret
          mb={16}
        />
        {errorMessage.length > 0 && <GoldBrokerText value={errorMessage} color={colors.danger} ssp fontSize={14} />}
      </FormContainer>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ForgottenPasswordScreen");
        }}
      >
        <GoldBrokerText i18nKey={"profile.login.form.forgotten_password"} sspB fontSize={17} />
      </TouchableOpacity>
      <NextStepButton active={stepCompleted} onPress={handleNextStepPress} />
    </Container>
  );
};
