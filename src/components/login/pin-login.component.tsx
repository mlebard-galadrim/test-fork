import { StackActions, useNavigation } from "@react-navigation/native";
import i18n from "i18n-js";
import React, { useEffect, useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { State, Store } from "../../store/configure.store";
import AppSlice from "../../store/slices/app.slice";
import AuthSlice from "../../store/slices/auth.slice";
import PreferencesSlice from "../../store/slices/preferences.slice";
import colors from "../../themes/colors.theme";
import { PinBar } from "../generic/pin/pinbar.component";
import { PinGrid } from "../generic/pin/pingrid.component";
import { TopBar } from "../generic/top-bar.component";
import { GoldBrokerText } from "../style/goldbroker-text.component";

const pinIcone = require("../../../assets/icons/register/icons-pincode.png");

const Container = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
`;

const FormContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 15px;
`;

export const PinLogin = () => {
  const navigation = useNavigation();
  const [pin, setPin] = useState("");
  const storePin = useSelector((state: State) => state.preferencesStore.pin);
  const { shouldNavigateMessages } = useSelector((state: State) => state.appStore);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    if (pin.length === 4) {
      if (pin === storePin) {
        dispatch(AppSlice.actions.setLastPinDate(new Date()));
        dispatch(AppSlice.actions.setShouldAskPin(false));
        if (shouldNavigateMessages) {
          navigation.navigate("Profile", { screen: "MessagesScreen" });
        } else {
          navigation.navigate("Profile");
        }
      } else {
        setPin("");
        setErrorMessage("profile.login.pin_welcome.error");
      }
    }
  }, [pin]);

  return (
    <Container>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            navigation.goBack();
          },
        }}
        mb={20}
      />
      <View
        style={{
          marginHorizontal: 60,
          alignItems: "center",
        }}
      >
        <Image source={pinIcone} style={{ marginBottom: 17 }} />
        <GoldBrokerText i18nKey={"profile.login.pin_welcome.login_instruction"} ssp fontSize={17} />
        <GoldBrokerText i18nKey={errorMessage} ssp fontSize={17} color={colors.danger} />
      </View>
      <FormContainer>
        <PinBar pin={pin} />
        <PinGrid pin={pin} setPin={setPin} />
      </FormContainer>
      <TouchableOpacity
        style={{ marginBottom: 16 }}
        onPress={() => {
          Alert.alert(
            i18n.t("profile.login.pin_welcome.alert.title"),
            i18n.t("profile.login.pin_welcome.alert.body"),
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  Store.dispatch(AuthSlice.actions.reset());
                  Store.dispatch(PreferencesSlice.actions.resetPin());
                  navigation.dispatch(StackActions.popToTop());
                  navigation.navigate("HomeScreen");
                },
              },
            ],
            { cancelable: false }
          );
        }}
      >
        <GoldBrokerText i18nKey="profile.login.pin_welcome.forgotten_pin" ssp fontSize={17} />
      </TouchableOpacity>
    </Container>
  );
};
