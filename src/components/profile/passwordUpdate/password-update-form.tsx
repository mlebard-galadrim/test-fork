import React, { useState } from "react";

import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { NextStepButton } from "../../generic/buttons/next-step-button.component";
import { PasswordUpdateStep } from "./password-update-step.component";
import { PasswordUpdateSuccess } from "./password-update-success.component";
import { View } from "react-native";
import { checkPassword } from "../../../utils/regex.util";
import colors from "../../../themes/colors.theme";
import styled from "styled-components";

const passwordIcon = require("../../../../assets/icons/login/icons-password.png");

const Container = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const PasswordUpdateForm = () => {
  const [step, setStep] = useState(1);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePress = () => {
    switch (step) {
      case 1:
        setStep(2);
        break;
      case 2:
        if (checkPassword(newPassword)) {
          setErrorMessage("");
          setStep(3);
        } else {
          setErrorMessage("profile.passwordUpdate.errors.strength");
        }
        break;
      case 3:
        if (newPassword !== confirmNewPassword) {
          setErrorMessage("profile.passwordUpdate.errors.confirmation");
          setStep(2);
        } else {
          setStep(4);
        }
        break;
      default:
        setStep(1);
    }
  };

  if (step === 4) {
    return <PasswordUpdateSuccess />;
  }

  return (
    <Container>
      {
        {
          1: (
            <PasswordUpdateStep
              password={currentPassword}
              setPassword={setCurrentPassword}
              instruction="profile.passwordUpdate.firstStep.instruction"
            />
          ),
          2: (
            <PasswordUpdateStep
              password={newPassword}
              setPassword={setNewPassword}
              instruction="profile.passwordUpdate.secondStep.instruction"
              detail="profile.passwordUpdate.secondStep.detail"
            />
          ),
          3: (
            <PasswordUpdateStep
              password={confirmNewPassword}
              setPassword={setConfirmNewPassword}
              instruction="profile.passwordUpdate.finalStep.instruction"
            />
          ),
        }[step]
      }
      {errorMessage.length > 0 && (
        <GoldBrokerText
          i18nKey={errorMessage}
          color={colors.danger}
          ssp
          fontSize={12}
        />
      )}
      <NextStepButton active={true} onPress={handlePress} />
    </Container>
  );
};
