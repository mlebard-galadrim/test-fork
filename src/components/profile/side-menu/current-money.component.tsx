import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import { formatCurrency } from "../../../utils/currencies.utils";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

const moneyIcon = require("../../../../assets/icons/profile/icons-espace-client-solde.png");

export const CurrentMoney = () => {
  const balances = useSelector((state: State) => state.userStore.balances);

  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={moneyIcon} style={{ marginRight: 10 }} />
        <GoldBrokerText i18nKey="profile.balance" sspL ls fontSize={14} gold />
      </View>
      {Object.keys(balances).map((currency) => {
        if (balances[currency]) {
          return (
            <View style={styles.balanceItem} key={currency}>
              <GoldBrokerText value={formatCurrency(currency || "EUR", balances[currency])} sspB fontSize={20} />
            </View>
          );
        }
      })}
    </>
  );
};

const styles = StyleSheet.create({
  balanceItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
