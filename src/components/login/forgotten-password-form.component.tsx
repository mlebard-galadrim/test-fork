import { Image, View } from "react-native";
import React, { useEffect, useState } from "react";

import { GoldBrokerText } from "../style/goldbroker-text.component";
import { GoldbrokerInput } from "../style/goldbroker-input.component";
import { NextStepButton } from "../generic/buttons/next-step-button.component";
import colors from "../../themes/colors.theme";
import { forgottenPassword } from "../../services/auth.service";
import i18n from "i18n-js";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/core";
import { validateEmail } from "../../utils/regex.util";

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

const passwordIcon = require("../../../assets/icons/login/icons-password.png");

export const ForgottenPasswordForm = () => {
  const [mail, setMail] = useState("");
  const [stepCompleted, setStepCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    setStepCompleted(validateEmail(mail));
  }, [mail]);

  const handleNextStepPress = () => {
    forgottenPassword(mail).then((r) => {
      if (r.success) {
        setErrorMessage("");
        navigation.navigate("ForgottenPasswordSuccessScreen");
      } else {
        setErrorMessage(r);
      }
    });
  };

  return (
    <Container>
      <Image source={passwordIcon} style={{ marginBottom: 17 }} />
      <GoldBrokerText i18nKey="profile.login.forgotten_password_form.instruction" ssp fontSize={17} />
      <FormContainer>
        <GoldbrokerInput
          value={mail}
          padding={0}
          radius={4}
          placeholder={i18n.t("profile.login.forgotten_password_form.mail_placeholder")}
          mb={16}
          onChange={setMail}
        />
        <GoldBrokerText i18nKey={"profile.login.forgotten_password_form.detail"} fontSize={12} gray mb={16} ssp />
        {errorMessage.length > 0 && <GoldBrokerText value={errorMessage} color={colors.danger} ssp fontSize={14} />}
      </FormContainer>
      <NextStepButton active={stepCompleted} onPress={handleNextStepPress} />
    </Container>
  );
};
