import React from "react";
import { View } from "react-native";
import { Table } from "../../graphics/tables/table.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

const headers = [
  {
    type: "blank",
    flex: 0.8,
  },
  {
    type: "header-text",
    value: "profile.coin_and_bar.resume.purchase_value",
    flex: 2,
  },
  {
    type: "header-text",
    value: "profile.coin_and_bar.resume.current_value",
    flex: 2,
  },
  {
    type: "header-text",
    value: "",
    center: true,
    flex: 1,
  },
];

export default function ResumeComponent({ notitle = false, summary }) {
  return (
    <View style={{ flex: 1, marginBottom: 55 }}>
      {!notitle ? <GoldBrokerText i18nKey="profile.coin_and_bar.resume.title" fontSize={27} left ml={16} /> : null}
      {summary.length > 0 ? <Table header={headers} rows={summary[0]} final={summary[1]} mt={0} /> : null}
    </View>
  );
}
