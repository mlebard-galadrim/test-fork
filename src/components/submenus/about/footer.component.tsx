import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import colors from "../../../themes/colors.theme";
import { LightButton } from "../../generic/buttons/light-button.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { TopBorder } from "./topborder.component";

const trustpilot = require("../../../../assets/icons/companies/trustpilot-gray.png");
const checkout = require("../../../../assets/icons/companies/checkout.png");

export const FooterBlock = () => {
  const navigation = useNavigation();

  const onCreateAccount = () => {
    navigation.navigate("RegisterNavigator");
  };
  return (
    <View style={styles.container}>
      <TopBorder />
      <GoldBrokerText i18nKey="leftMenu.submenus.about.security" fontSize={32} mt={32} mb={40} ml={50} mr={50} />
      <Image source={checkout} style={{ marginBottom: 32 }} />
      <Image source={trustpilot} style={{ marginBottom: 32 }} />
      <View style={styles.createAccount}>
        <GoldBrokerText i18nKey="leftMenu.submenus.about.invest" fontSize={32} mb={32} mh={12} />
        <LightButton mh={34} large i18nKey="account.createAccount" onPress={onCreateAccount} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
    alignItems: "center",
    paddingBottom: 57,
  },
  createAccount: {
    paddingTop: 46,
    paddingBottom: 46,
    marginLeft: 16,
    marginRight: 16,
    backgroundColor: colors.lightDark,
  },
});
