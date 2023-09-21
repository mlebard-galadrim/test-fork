import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { SectionTitle } from "../../generic/section-title.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import BillListItemComponent from "../bills/bill-list-component";

export default function BillSectionComponent() {
  const navigation = useNavigation();
  const invoices = useSelector((state: State) => state.invoiceStore.invoices);
  const currency = useSelector((state: State) => state.userStore.currency);
  return (
    <View style={{ marginBottom: 55 }}>
      <View style={styles.title}>
        <SectionTitle i18nKey="profile.dashboard.bill" mb={0} />

        <TouchableOpacity onPress={() => navigation.navigate("BillsScreen")}>
          <GoldBrokerText i18nKey="profile.dashboard.seemore" ssp color={colors.gold} fontSize={16} />
        </TouchableOpacity>
      </View>
      {invoices.length > 0 ? (
        invoices.slice(0, 3).map((invoice, index) => {
          return <BillListItemComponent bill={invoice} currency={currency} key={index} />;
        })
      ) : (
        <View style={{ backgroundColor: colors.gray2, borderRadius: 2, padding: 16, marginHorizontal: 16 }}>
          <GoldBrokerText i18nKey="profile.dashboard.emptyBill" sspL left fontSize={16} ls color={colors.text.lightGray} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 26,
  },
});
