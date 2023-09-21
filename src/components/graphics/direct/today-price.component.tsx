import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import { formatCurrency } from "../../../utils/currencies.utils";
import { SectionTitle } from "../../generic/section-title.component";
import { Table } from "../tables/table.component";

const headers = [
  {
    type: "blank",
    flex: 0.5,
  },
  {
    type: "header-text",
    flex: 1,
    value: "charts.all_metals_chart.headers.performance",
  },
  {
    type: "header-text",
    value: "charts.all_metals_chart.headers.once",
  },
  {
    type: "header-text",
    value: "charts.all_metals_chart.headers.kg",
  },
];

const buildData = (metals, metal, currencies) => {
  const data = currencies.map((currency) => {
    return [
      {
        type: "text",
        value: currency.code,
        flex: 0.5,
      },
      {
        type: "performance",
        flex: 1,
        value: "12.15", //metals[metal][currency.code].oz.performance,
      },
      {
        type: "text",
        value: formatCurrency(currency.code, metals[metal][currency.code].oz.value),
      },
      {
        type: "text",
        value: formatCurrency(currency.code, metals[metal][currency.code].kg.value),
      },
    ];
  });
  return data;
};

export const TodayPrice = ({ metal }) => {
  const [data, setData] = useState([]);
  const metals = useSelector((state: State) => state.metalsStore);
  const currencies = useSelector((state: State) => state.dataStore.currencies);
  useEffect(() => {
    setData(buildData(metals, metal, currencies));
  }, [metal]);

  return (
    <View style={{ marginTop: 22 }}>
      <View style={{ marginHorizontal: 8 }}>
        <SectionTitle i18nKey={`charts.direct.today_prices.title.${metal}`} fontSize={27} mb={16} />
      </View>
      <Table header={headers} rows={data} mt={0} />
    </View>
  );
};
