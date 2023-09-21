import React, { useEffect, useState } from "react";
import { State, Store } from "../../../store/configure.store";

import { PinUpdateStep } from "./pin-update-step.component";
import { PinUpdateSuccess } from "./pin-update-success.component";
import PreferencesSlice from "../../../store/slices/preferences.slice";
import { View } from "react-native";
import styled from "styled-components";
import { useSelector } from "react-redux";

const Container = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
`;

export const PinUpdateForm = () => {
  const [step, setStep] = useState(1);
  const storedPin = useSelector((state: State) => state.preferencesStore.pin);
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setErrorMessage("");
  }, []);

  useEffect(() => {
    if (currentPin.length === 4) {
      if (currentPin === storedPin) {
        setStep(2);
        setErrorMessage("");
      } else {
        setErrorMessage("profile.pinUpdate.firstStep.error");
      }
    } else {
      setErrorMessage("");
    }
  }, [currentPin]);

  useEffect(() => {
    if (newPin.length === 4) {
      setStep(3);
    }
  }, [newPin]);

  useEffect(() => {
    if (confirmNewPin.length === 4) {
      if (confirmNewPin === newPin) {
        Store.dispatch(PreferencesSlice.actions.setPin(newPin));
        setStep(4);
      } else {
        setErrorMessage("profile.pinUpdate.finalStep.error");
        setConfirmNewPin("");
      }
    }
  }, [confirmNewPin]);

  return (
    <Container>
      {
        {
          1: (
            <PinUpdateStep
              pin={currentPin}
              setPin={setCurrentPin}
              instruction="profile.pinUpdate.firstStep.instruction"
              error={errorMessage}
            />
          ),
          2: <PinUpdateStep pin={newPin} setPin={setNewPin} instruction="profile.pinUpdate.secondStep.instruction" />,
          3: (
            <PinUpdateStep
              pin={confirmNewPin}
              setPin={setConfirmNewPin}
              instruction="profile.pinUpdate.finalStep.instruction"
              error={errorMessage}
            />
          ),
          4: <PinUpdateSuccess />,
        }[step]
      }
    </Container>
  );
};
