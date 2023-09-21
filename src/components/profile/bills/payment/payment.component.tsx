import { useNavigation } from "@react-navigation/native";
import i18n from "i18n-js";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { getPaypal, paymentDone, postBalance } from "../../../../services/payment.service";
import colors from "../../../../themes/colors.theme";
import { LightButton } from "../../../generic/buttons/light-button.component";
import { GoldBrokerText } from "../../../style/goldbroker-text.component";
export const PaymentMethods = ({ invoiceNumber, useBalance, amount }) => {
  const navigation = useNavigation();

  const handleCheckoutSelection = () => {
    navigation.navigate("CheckoutScreen", { invoice_number: invoiceNumber, use_balance: useBalance });
  };

  const handlePaypalSelection = () => {
    getPaypal(invoiceNumber, (+useBalance).toString())
      .then((r) => {
        navigation.navigate("PaypalScreen", {
          invoiceNumber: invoiceNumber,
          paypalURI: r.request.responseURL,
        });
      })
      .catch((err) => {
        Alert.alert(i18n.t("profile.bills.error"));
        navigation.navigate("BillsScreen");
      });
  };

  const handleTransferSelection = () => {
    navigation.navigate("FundTransferScreen");
  };

  const handleBalanceSelection = () => {
    postBalance(invoiceNumber)
      .then((res) => {
        paymentDone(invoiceNumber).then((res) => {
          navigation.navigate("PaymentSuccessScreen", { bill: res });
        });
      })
      .catch((err) => {
        Alert.alert(i18n.t("profile.bills.error"));
        navigation.navigate("BillsScreen");
      });
  };

  if (useBalance && amount === 0) {
    return <LightButton large i18nKey="profile.bills.recap.payment.balance" onPress={handleBalanceSelection} />;
  }

  return (
    <View>
      <TouchableOpacity style={styles.row} onPress={handleCheckoutSelection}>
        <GoldBrokerText ssp left i18nKey="profile.bills.recap.payment.card" />
        <Icon name="chevron-right" size={25} style={{ color: colors.gray }} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={handlePaypalSelection}>
        <GoldBrokerText ssp left i18nKey="profile.bills.recap.payment.paypal" />
        <Icon name="chevron-right" size={25} style={{ color: colors.gray }} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.row} onPress={handleTransferSelection}>
        <GoldBrokerText ssp left i18nKey="profile.bills.recap.payment.transfer" />
        <Icon name="chevron-right" size={25} style={{ color: colors.gray }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: colors.dark,
    marginBottom: 4,
  },
});
