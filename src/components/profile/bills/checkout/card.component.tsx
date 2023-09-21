import { useNavigation } from "@react-navigation/native";
import { CardNumber, Cvv, ExpiryDate, Frames, SubmitButton } from "frames-react-native";
import i18n from "i18n-js";
import React, { useState } from "react";
import { Alert, Dimensions, Image, ScaledSize, StyleSheet, TextProps, View } from "react-native";
import * as Sentry from "sentry-expo";
import { environment } from "../../../../environments";
import { postCheckout } from "../../../../services/payment.service";
import colors from "../../../../themes/colors.theme";
import { GoldBrokerText } from "../../../style/goldbroker-text.component";
import { ThreeDSecureModal } from "./3Dsecure.component";

const checkoutIcon = require("../../../../../assets/icons/profile/payment/checkout.png");
const masterIcon = require("../../../../../assets/icons/profile/payment/logo-mastercard.png");
const sslIcon = require("../../../../../assets/icons/profile/payment/ssl.png");
const visaIcon = require("../../../../../assets/icons/profile/payment/visa-inc-logo-1.png");

export const CardComponent = ({ invoice_number, use_balance }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [threeDURL, setThreeDURL] = useState<string>("");
  const [logosHeight, setLogosHeight] = useState<ScaledSize>(Dimensions.get("window"));

  const navigation = useNavigation();

  const handlePay = (token) => {
    postCheckout(invoice_number, token, "card", 0, +use_balance)
      .then((res) => {
        setVisible(true);
        setThreeDURL(res.request.responseURL);
      })
      .catch((err) => {
        Sentry.Native.captureException(err);
        Alert.alert(i18n.t("profile.bills.error"));
        navigation.navigate("BillsScreen");
      });
  };

  const [errorMessage, setErrorMessage] = useState<string>("");

  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      <Frames
        config={{
          debug: false,
          publicKey: environment.checkoutKey,
        }}
        cardTokenized={(e) => {
          handlePay(e.token);
        }}
        cardTokenizationFailed={(e) => {
          setErrorMessage("Invalid card number");
        }}
      >
        <View style={{ width: "80%", alignSelf: "center" }}>
          <CardNumber style={styles.cardNumber} placeholderTextColor="#9898A0" />

          <View style={styles.dateAndCode}>
            <ExpiryDate style={styles.expiryDate} placeholderTextColor="#9898A0" />
            <Cvv style={styles.cvv} placeholderTextColor="#9898A0" />
          </View>
        </View>
        {errorMessage.length > 0 ? (
          <View>
            <GoldBrokerText value={errorMessage} sspL fontSize={15} color={"red"} mt={8} />
          </View>
        ) : null}
        <SubmitButton title={i18n.t("profile.bills.pay")} style={styles.button} textStyle={styles.buttonText as TextProps} />
      </Frames>
      <View
        style={{
          marginTop: 70,
          position: "relative",
          top: 0,
          alignItems: "center",
        }}
      >
        <Image style={{ marginBottom: 30 }} source={checkoutIcon} />
        <Image style={{ marginBottom: 30 }} source={visaIcon} />
        <Image style={{ marginBottom: 30 }} source={masterIcon} />
        <Image style={{ marginBottom: 30 }} source={sslIcon} />
      </View>
      <ThreeDSecureModal {...{ threeDURL, visible, setVisible, invoice_number }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingLeft: 10,
    paddingRight: 10,
  },
  dateAndCode: {
    marginVertical: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardNumber: {
    fontSize: 18,
    height: 50,
    color: colors.black,
    backgroundColor: colors.white,
    borderColor: "#3A4452",
    borderRadius: 5,
    borderWidth: 0,
  },
  expiryDate: {
    fontSize: 18,
    height: 50,
    width: "48%",
    color: colors.black,
    backgroundColor: colors.white,
    borderRadius: 4,
    borderWidth: 0,
  },
  cvv: {
    fontSize: 18,
    height: 50,
    width: "48%",
    color: colors.black,
    backgroundColor: colors.white,
    borderRadius: 4,
    borderWidth: 0,
  },
  button: {
    height: 50,
    alignSelf: "center",
    borderRadius: 20,
    marginTop: 15,
    width: "50%",
    justifyContent: "center",
    backgroundColor: colors.gold,
  },
  buttonText: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 16,
  },
});
