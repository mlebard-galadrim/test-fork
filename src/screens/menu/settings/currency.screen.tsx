import { StyleSheet, TouchableOpacity, View } from "react-native";
import { State, Store } from "../../../store/configure.store";

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useSelector } from "react-redux";
import { CheckBox } from "../../../components/generic/checkbox.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { GoldBrokerText } from "../../../components/style/goldbroker-text.component";
import { useUserPreferences } from "../../../hooks/useUserPreferences";
import DataSlice from "../../../store/slices/data.slice";
import colors from "../../../themes/colors.theme";

const CurrencyItem = (props) => {
  return (
    <View style={styles.item}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <GoldBrokerText ssp fontSize={18} value={props.currency.code} />
        <GoldBrokerText ssp fontSize={18} value=" - " />
        <GoldBrokerText ssp fontSize={18} value={props.currency.name} />
        <GoldBrokerText ssp fontSize={18} value={` (${props.currency.symbol})`} />
      </View>
      <View>
        <CheckBox round checked={props.checked} />
      </View>
    </View>
  );
};

export const CurrencyScreen = () => {
  const currencies = useSelector((state: State) => state.dataStore.currencies);

  const navigation = useNavigation();
  const { currency, handleCurrencyChange } = useUserPreferences();

  return (
    <View style={{ flex: 1 }}>
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
          title: "leftMenu.submenus.settings.menus.currency.title",
        }}
      />
      <View style={{ flex: 1, marginHorizontal: 14 }}>
        {currencies.map((item, key) => {
          return (
            <TouchableOpacity
              onPress={() => {
                handleCurrencyChange(item.code);
                Store.dispatch(DataSlice.actions.setSelectedCurrency(item.code));
              }}
              key={key}
            >
              <CurrencyItem currency={item} checked={currency === item.code} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.gray,
    padding: 10,
    marginBottom: 4,
    justifyContent: "space-between",
  },
});
