import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { UseDownload } from "../../../../hooks/useDownload";
import colors from "../../../../themes/colors.theme";
import { formatCurrency } from "../../../../utils/currencies.utils";
import { GoldBrokerText } from "../../../style/goldbroker-text.component";

export const InvoiceComponent = ({ invoice, currency }) => {
  const { downloadFile } = UseDownload();

  return (
    <View style={styles.invoiceContainer}>
      <View>
        <GoldBrokerText left sspL value={invoice.type} fontSize={18} />
        {invoice.document ? (
          <TouchableOpacity
            style={styles.attachment}
            onPress={() => downloadFile(invoice.document.name, invoice.document.url)}
          >
            <Entypo name="attachment" size={14} style={{ marginRight: 8 }} color={colors.gold} />
            <GoldBrokerText value={invoice.document.name} ssp underline color={colors.gold} fontSize={14} />
          </TouchableOpacity>
        ) : null}
      </View>
      <View>
        <GoldBrokerText right sspL value={formatCurrency(currency, invoice.amount.toFixed(2))} fontSize={18} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  invoiceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.gray2,
    marginBottom: 4,
  },
  attachment: {
    flexDirection: "row",
    alignItems: "center",
  },
});
