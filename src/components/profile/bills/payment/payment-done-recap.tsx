import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import colors from "../../../../themes/colors.theme";
import { formatCurrency } from "../../../../utils/currencies.utils";
import { GoldBrokerText } from "../../../style/goldbroker-text.component";
import { InvoiceComponent } from "./invoice-component";

export const PaymentDoneRecap = ({ bill }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <GoldBrokerText sspL uppercase color={colors.transparent5} fontSize={18} ls i18nKey="profile.bills.done.column1" />
        <GoldBrokerText sspL uppercase color={colors.transparent5} fontSize={18} ls i18nKey="profile.bills.done.column2" />
      </View>
      {bill ? (
        <View style={{ marginBottom: 24 }}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={bill.items}
            renderItem={({ item, index }) => <InvoiceComponent key={index} invoice={item} currency={item.currency} />}
          />
        </View>
      ) : null}
      <View style={{ flexDirection: "row", marginHorizontal: 25, marginBottom: 12 }}>
        <View style={{ flex: 3 }}>
          <GoldBrokerText right ssp i18nKey="profile.bills.done.balance" color={colors.transparent5} fontSize={18} />
        </View>
        <View style={{ flex: 2 }}>
          <GoldBrokerText
            right
            sspL
            value={bill.balance_amount ? formatCurrency(bill.currency, bill.balance_amount.toFixed(2)) : 0}
            color={colors.transparent5}
            fontSize={18}
          />
        </View>
      </View>
      <View style={{ flexDirection: "row", marginHorizontal: 25, marginBottom: 12 }}>
        <View style={{ flex: 3 }}>
          <GoldBrokerText right ssp i18nKey="profile.bills.done.total" fontSize={18} />
        </View>
        <View style={{ flex: 2 }}>
          <GoldBrokerText right ssp value={formatCurrency(bill.currency, bill.amount.toFixed(2))} fontSize={18} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    backgroundColor: colors.lightDark,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 26,
    marginBottom: 19,
    paddingHorizontal: 15,
  },
});
