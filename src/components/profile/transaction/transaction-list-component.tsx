import { StyleSheet, TouchableOpacity, View } from "react-native";

import { Entypo } from "@expo/vector-icons";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import React from "react";
import { State } from "../../../store/configure.store";
import { UseDownload } from "../../../hooks/useDownload";
import colors from "../../../themes/colors.theme";
import { convertTZ } from "../../../utils/date.utils";
import { formatCurrency } from "../../../utils/currencies.utils";
import { useSelector } from "react-redux";

export default function TransactionListItemComponent({
  transaction,
  currency,
}) {
  const timezone = useSelector((state: State) => state.appStore.timezone);
  const locale = useSelector((state: State) => state.appStore.locale);
  const transactionsType = useSelector(
    (state: State) => state.transactionStore.types
  );

  const { downloadFile } = UseDownload();

  const transactionType = transactionsType.filter(
    (type) => type.value === transaction.type
  );

  const formatedDate = convertTZ(transaction.date, timezone, locale);

  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: colors.gray }}>
      <View style={styles.date}>
        <GoldBrokerText
          left
          value={formatedDate}
          ssp
          fontSize={12}
          color={colors.transparent5}
        />
      </View>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          {transactionType[0] ? (
            <GoldBrokerText
              value={transactionType[0].label}
              ssp
              fontSize={17}
            />
          ) : (
            <GoldBrokerText value={transaction.type} ssp fontSize={17} />
          )}
          <GoldBrokerText
            value={formatCurrency(currency, transaction.amount.toFixed(2))}
            ssp
            fontSize={16}
          />
        </View>
        {transaction.document && (
          <TouchableOpacity
            style={styles.attachment}
            onPress={() =>
              downloadFile(transaction.document.name, transaction.document.url)
            }
          >
            <Entypo
              name="attachment"
              size={14}
              style={{ marginRight: 8 }}
              color={colors.gold}
            />
            <GoldBrokerText
              value={transaction.document.name}
              ssp
              underline
              color={colors.gold}
              fontSize={14}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  date: {
    flex: 1,
    backgroundColor: colors.dark,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  container: {
    backgroundColor: colors.gray3,
    padding: 16,
  },
  attachment: {
    flexDirection: "row",
    alignItems: "center",
  },
});
