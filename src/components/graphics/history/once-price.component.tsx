import React from "react";
import { SectionTitle } from "../../generic/section-title.component";
import { Table } from "../tables/table.component";
import { View } from "react-native";

const headers = [
  {
    type: "header-text",
    value: "charts.history.once_price_table.headers.period",
    center: true,
  },
  {
    type: "header-text",
    value: "charts.history.once_price_table.headers.performance",
    center: true,
  },
];

const buildData = (data) => {
  return Object.keys(data)
    .filter((period) => period !== "MAX")
    .map((period) => {
      if (period !== "MAX") {
        return [
          {
            type: "text",
            value: period,
            center: true,
          },
          {
            type: "performance",
            value: data[period],
            center: true,
          },
        ];
      }
    });
};

export const OncePrice = ({ performancesHistory }) => {
  const data = buildData(performancesHistory);
  return (
    <View style={{ marginTop: 32 }}>
      <SectionTitle i18nKey="charts.history.once_price_table.title" fontSize={27} mb={16} />
      <Table header={headers} rows={data} mt={0} />
    </View>
  );
};
