import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { UseDownload } from "../../../hooks/useDownload";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { formatCurrency } from "../../../utils/currencies.utils";
import { convertTZ } from "../../../utils/date.utils";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { BillStatus } from "./bill-status";

export default function BillListItemComponent({ bill, currency }) {
  const timezone = useSelector((state: State) => state.appStore.timezone);
  const locale = useSelector((state: State) => state.appStore.locale);
  const statuses = useSelector((state: State) => state.invoiceStore.statuses);
  const billTypes = useSelector((state: State) => state.invoiceStore.types);
  const navigation = useNavigation();
  const billType = billTypes.filter((type) => type.value === bill.type);
  const { downloadFile } = UseDownload();
  const formatedDate = convertTZ(bill.date, timezone, locale);

  return (
    <TouchableOpacity
      style={{ borderBottomWidth: 1, borderBottomColor: colors.gray }}
      disabled={!bill.payable}
      onPress={() => {
        navigation.navigate("BillScreen", { invoiceNumber: bill.invoice_number });
      }}
    >
      <View style={styles.date}>
        <GoldBrokerText left value={formatedDate} ssp fontSize={12} color={colors.transparent5} />
      </View>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <GoldBrokerText value={billType[0].label} ssp fontSize={17} />
          <GoldBrokerText value={formatCurrency(currency, bill.amount.toFixed(2))} ssp fontSize={16} />
        </View>
        {bill.document ? (
          <TouchableOpacity style={styles.attachment} onPress={() => downloadFile(bill.document.name, bill.document.url)}>
            <Entypo name="attachment" size={14} style={{ marginRight: 8 }} color={colors.gold} />
            <GoldBrokerText value={bill.document.name} ssp underline color={colors.gold} fontSize={14} />
          </TouchableOpacity>
        ) : null}
        {bill.status ? <BillStatus status={bill.status} name={statuses[bill.status]} payable={bill.payable} /> : null}
      </View>
    </TouchableOpacity>
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
