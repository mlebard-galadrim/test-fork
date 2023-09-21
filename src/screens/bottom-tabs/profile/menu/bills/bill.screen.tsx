import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import { PaymentMethods } from "../../../../../components/profile/bills/payment/payment.component";
import { PaymentRecap } from "../../../../../components/profile/bills/payment/pre-payment-recap";
import { GoldBrokerText } from "../../../../../components/style/goldbroker-text.component";
import { getInvoice } from "../../../../../services/payment.service";
import colors from "../../../../../themes/colors.theme";
import { BillPayment } from "../../../../../type/bills.type";

const recapIcon = require("../../../../../../assets/icons/profile/icons-r-capitulatif.png");
const paymentIcon = require("../../../../../../assets/icons/profile/icons-payer-par.png");

export const BillScreen = ({ route }) => {
  const navigation = useNavigation();
  const { invoiceNumber } = route.params;
  const [bill, setBill] = useState<BillPayment>();
  const [useBalance, setUseBalance] = useState<boolean>(false);

  useEffect(() => {
    getInvoice(invoiceNumber, useBalance ? 1 : 0)
      .then((r) => {
        setBill(r);
      })
      .catch((err) => console.warn(err));
  }, [useBalance]);
  return (
    <ScrollView style={styles.container}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            navigation.goBack();
          },
        }}
        middle={{
          type: "text",
          title: "profile.bills.recap.screenTitle",
        }}
      />
      {bill ? (
        <View style={styles.recapContainer}>
          <View style={styles.recapTitle}>
            <Image source={recapIcon} style={{ marginRight: 12 }} />
            <GoldBrokerText i18nKey="profile.bills.recap.title" fontSize={24} />
          </View>
          <PaymentRecap {...{ bill, useBalance, setUseBalance }} />
          <View style={styles.recapTitle}>
            <Image source={paymentIcon} style={{ marginRight: 12 }} />
            <GoldBrokerText i18nKey="profile.bills.recap.paymentTitle" fontSize={24} />
          </View>
          <PaymentMethods invoiceNumber={invoiceNumber} useBalance={useBalance} amount={bill.amount} />
        </View>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recapContainer: {
    flex: 1,
    marginHorizontal: 18,
  },
  recapTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  recapBody: {
    backgroundColor: colors.lightDark,
    marginBottom: 40,
  },
  recapFooterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 25,
  },
  balanceCheckbox: { flex: 1.5, flexDirection: "row", alignItems: "center" },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 26,
    marginBottom: 19,
    paddingHorizontal: 15,
  },
});
