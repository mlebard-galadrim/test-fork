import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { State } from "../../../../store/configure.store";
import colors from "../../../../themes/colors.theme";
import { formatCurrency } from "../../../../utils/currencies.utils";
import { CheckBox } from "../../../generic/checkbox.component";
import { GoldBrokerText } from "../../../style/goldbroker-text.component";
import { InvoiceComponent } from "./invoice-component";

export const PaymentRecap = ({ bill, useBalance, setUseBalance }) => {
  const userCurrency = useSelector((state: State) => state.userStore.currency);
  const currentBalance = useSelector((state: State) => state.userStore.balances[userCurrency]);
  const [balanceAmountUsed, setBalanceAmountUsed] = useState(0);

  useEffect(() => {
    if (useBalance && currentBalance) {
      // Compute total price of the bill
      const totalPrice = bill.items.reduce((prev: number, cur) => prev + cur.amount, 0);
      // Compute the amount to use from the current balance
      const balanceAmount = currentBalance >= totalPrice ? totalPrice : currentBalance;
      // Format the amount to use from the current balance
      const formattedBalance = balanceAmount.toFixed(2);
      // Set to the state the amount to use from the current balance
      setBalanceAmountUsed(formattedBalance);
    } else {
      setBalanceAmountUsed(0);
    }
  }, [useBalance]);

  return (
    <View style={styles.recapBody}>
      <View style={styles.titleContainer}>
        <GoldBrokerText sspL uppercase color={colors.transparent5} fontSize={18} ls value="Type" />
        <GoldBrokerText sspL uppercase color={colors.transparent5} fontSize={18} ls value="Montant" />
      </View>
      <View style={{ marginBottom: 20 }}>
        {bill ? bill.items.map((b, index) => <InvoiceComponent key={index} invoice={b} currency={b.currency} />) : null}
      </View>
      {currentBalance ? (
        <View style={styles.recapFooterRow}>
          <TouchableOpacity style={styles.balanceCheckbox} onPress={() => setUseBalance(!useBalance)}>
            <View style={{ marginRight: 12 }}>
              <CheckBox checked={useBalance} round />
            </View>
            <Text>
              <GoldBrokerText i18nKey="profile.bills.recap.useBalance" sspL fontSize={17} color={colors.transparent5} />
              <GoldBrokerText
                value={` (${formatCurrency(userCurrency || "EUR", currentBalance.toFixed(2))})`}
                sspL
                fontSize={17}
                color={colors.transparent5}
                style={{ flex: 1, flexWrap: "wrap" }}
              />
            </Text>
          </TouchableOpacity>
          <GoldBrokerText
            flex
            right
            sspL
            fontSize={18}
            color={colors.transparent5}
            value={`${balanceAmountUsed > 0 ? "-" : ""} ${formatCurrency(bill.currency, balanceAmountUsed)}`}
          />
        </View>
      ) : null}
      <View style={styles.recapFooterRow}>
        <View style={{ flex: 1.5 }}>
          <GoldBrokerText flex right ssp fontSize={18} i18nKey="profile.bills.recap.total" />
        </View>
        <GoldBrokerText flex right ssp fontSize={18} value={formatCurrency(bill.currency, bill.amount)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recapContainer: {
    flex: 1,
    marginHorizontal: 18,
  },
  recapTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  balanceCheckbox: { flex: 1.3, flexDirection: "row", alignItems: "center" },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 26,
    marginBottom: 19,
    paddingHorizontal: 15,
  },
});
