import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useUserPreferences } from "../../hooks/useUserPreferences";
import { createSubscription } from "../../services/newsletter.service";
import { createUser, updateUserPreferences } from "../../services/users.service";
import { State, Store } from "../../store/configure.store";
import PreferencesSlice from "../../store/slices/preferences.slice";
import RegisterSlice from "../../store/slices/register.slice";
import colors from "../../themes/colors.theme";
import { PinBar } from "../generic/pin/pinbar.component";
import { PinGrid } from "../generic/pin/pingrid.component";
import { GoldBrokerText } from "../style/goldbroker-text.component";

const pinIcon = require("../../../assets/icons/register/icons-pincode.png");

export const PinStep = (props) => {
  const [pin, setPin] = useState("");
  const [confirmationPin, setConfirmationPin] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [pinMismatch, setPinMismatch] = useState(false);
  const navigation = useNavigation();
  const { mail, firstname, lastname, legalStatus, companyName, password, secondPassword, tosRead, metalNewsletter, subscribedToInAppNewsletter } =
    useSelector((state: State) => state.registerStore);
  const { timezone, currency, locale, storageFeePeriod } = useUserPreferences();

  useEffect(() => {
    if (pin.length === 4 && !confirmation) {
      setConfirmation(true);
    }
  }, [pin]);

  useEffect(() => {
    if (confirmationPin.length === 4) {
      if (confirmationPin === pin) {
        createUser(legalStatus, companyName, firstname, lastname, mail, password, secondPassword, subscribedToInAppNewsletter, tosRead)
          .then(async (r) => {
            if (r.code === 400) {
              Store.dispatch(RegisterSlice.actions.setError(r.errors.children));
              navigation.navigate("RegisterFormScreen");
            } else {
              if (metalNewsletter) {
                await createSubscription(mail);
              }
              Store.dispatch(PreferencesSlice.actions.setPin(pin));
              Store.dispatch(RegisterSlice.actions.reset());
              void updateUserPreferences({
                timezone,
                currency,
                locale,
                storageFeePeriod: storageFeePeriod ? 1 : 0,
                subscribedToInAppNewsletter: subscribedToInAppNewsletter ? 1 : 0,
              });
              navigation.navigate("RegisterSuccessScreen");
            }
          })
          .catch((e) => {
            console.warn(e);
          });
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
