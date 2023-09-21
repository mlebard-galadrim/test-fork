import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

export default function CurrencyPickerComponent({ notitle = false, selected, setSelected }) {
  const currencies = useSelector((state: State) => state.dataStore.currencies);
  return (
    <View>
      {!notitle ? <GoldBrokerText i18nKey="profile.fund_transfer.currency_pick" sspL mb={16} mh={60} /> : null}
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {currencies.map((currency, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles(selected === currency.code).button}
              onPress={() => setSelected(currency.code)}
            >
              <GoldBrokerText
                value={currency.code}
                sspL
                color={selected === currency.code ? colors.white : colors.text.gray}
                ls
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = (selected) =>
  StyleSheet.create({
    button: {
      padding: 8,
      borderWidth: 1,
      marginRight: 8,
      borderRadius: 4,
      borderColor: selected ? colors.gold : colors.text.gray,
      backgroundColor: selected ? colors.gray2 : undefined,
    },
  });
