import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import AppSlice from "../../store/slices/app.slice";
import AuthSlice from "../../store/slices/auth.slice";
import PreferencesSlice from "../../store/slices/preferences.slice";
import colors from "../../themes/colors.theme";
import { PinBar } from "../generic/pin/pinbar.component";
import { PinGrid } from "../generic/pin/pingrid.component";
import { GoldBrokerText } from "../style/goldbroker-text.component";

const pinIcon = require("../../../assets/icons/register/icons-pincode.png");

export const PinInitiate = (props) => {
  const [pin, setPin] = useState("");
  const [confirmationPin, setConfirmationPin] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [pinMismatch, setPinMismatch] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (pin.length === 4 && !confirmation) {
      setConfirmation(true);
    }
  }, [pin]);

  useEffect(() => {
    if (confirmationPin.length === 4) {
      if (confirmationPin === pin) {
        dispatch(PreferencesSlice.actions.setPin(pin));
        dispatch(AuthSlice.actions.setToken(props.token));
        dispatch(AuthSlice.actions.setRefreshToken(props.refresh_token));
        dispatch(AppSlice.actions.setFromLogin({ now: new Date(), shouldAskPin: false, lastPinDate: new Date() }));
        // dispatch(AppSlice.actions.setNow(new Date()));
        // dispatch(AppSlice.actions.setShouldAskPin(false));
        navigation.navigate("Profile");
      } else {
        setPinMismatch(true);
      }
    } else {
      setPinMismatch(false);
    }
  }, [confirmationPin]);

  return (
    <View style={styles.container}>
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Image source={pinIcon} style={{ width: 32, height: 32, marginBottom: 24 }} />
        {confirmation ? (
          <>
            <GoldBrokerText i18nKey={"register.pincode.confirmationInstruction"} ssp mb={6} fontSize={17} />
            <GoldBrokerText value={" "} ssp mb={22} mh={80} fontSize={14} />
          </>
        ) : (
          <>
            <GoldBrokerText i18nKey={"register.pincode.instruction"} ssp mb={6} fontSize={17} />
            <GoldBrokerText i18nKey={"register.pincode.detail"} ssp mb={6} mh={80} fontSize={14} />
          </>
        )}
      </View>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <PinBar pin={confirmation ? confirmationPin : pin} />
        {pinMismatch && <GoldBrokerText ssp fontSize={14} color={colors.danger} i18nKey="register.pincode.mismatch" />}
        <PinGrid pin={confirmation ? confirmationPin : pin} setPin={confirmation ? setConfirmationPin : setPin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingBottom: 16,
  },
});
