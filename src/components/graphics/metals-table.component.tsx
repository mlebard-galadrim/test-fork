import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { metalsConstant } from "../../constants/metals.constant";
import { State } from "../../store/configure.store";
import { formatCurrency } from "../../utils/currencies.utils";
import { loadUnitsPrices } from "../../utils/data.utils";
import { Table } from "./tables/table.component";

const headers = [
  {
    type: "blank",
    flex: 0.5,
  },
  {
    type: "header-text",
    value: "",
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

const buildData = (metals, currency) => {
  return [
    [
      {
        type: "icon",
        source: require("../../../assets/icons/metals/or.png"),
        flex: 0.5,
      },
      {
        type: "performance",
        value: metals.XAU[currency]?.oz.performance?.toFixed(2),
        flex: 0,
      },
      {
        type: "text",
        value: formatCurrency(currency, metals.XAU[currency]?.oz.value.toFixed(2)),
      },
      {
        type: "text",
        value: formatCurrency(currency, metals.XAU[currency]?.kg.value.toFixed(2)),
      },
    ],
    [
      {
        type: "icon",
        source: require("../../../assets/icons/metals/argent.png"),
        flex: 0.5,
      },
      {
        type: "performance",
        value: metals.XAG[currency]?.oz.performance?.toFixed(2),
        flex: 0,
      },
      {
        type: "text",
        value: formatCurrency(currency, metals.XAG[currency]?.oz.value.toFixed(2)),
      },
      {
        type: "text",
        value: formatCurrency(currency, metals.XAG[currency]?.kg.value.toFixed(2)),
      },
    ],
    [
      {
        type: "icon",
        source: require("../../../assets/icons/metals/palladium.png"),
        flex: 0.5,
      },
      {
        type: "performance",
        value: metals.XPD[currency]?.oz.performance?.toFixed(2),
        flex: 0,
      },
      {
        type: "text",
        value: formatCurrency(currency, metals.XPD[currency]?.oz.value.toFixed(2)),
      },
      {
        type: "text",
        value: formatCurrency(currency, metals.XPD[currency]?.kg.value.toFixed(2)),
      },
    ],
    [
      {
        type: "icon",
        source: require("../../../assets/icons/metals/platine.png"),
        flex: 0.5,
      },
      {
        type: "performance",
        value: metals.XPT[currency]?.oz.performance?.toFixed(2),
        flex: 0,
      },
      {
        type: "text",
        value: formatCurrency(currency, metals.XPT[currency]?.oz.value.toFixed(2)),
      },
      {
        type: "text",
        value: formatCurrency(currency, metals.XPT[currency]?.kg.value.toFixed(2)),
      },
    ],
  ];
};

const initialMetalState = {
  XAU: {},
  XAG: {},
  XPT: {},
  XPD: {},
};

export const MetalsTable = () => {
  const { selectedCurrency } = useSelector((state: State) => state.dataStore);
  const [data, setData] = useState([]);
  const [metal, setMetal] = useState(initialMetalState);

  const loadMetal = async () => {
    const newMetalObject = {
      XAU: {},
      XAG: {},
      XPT: {},
      XPD: {},
    };
    await Promise.all(
      metalsConstant.map(async (metal) => {
        const value = await loadUnitsPrices(metal.id, selectedCurrency);
        newMetalObject[metal.id] = value;
      })
    );
    setMetal(newMetalObject);
  };

  useEffect(() => {
    loadMetal();
  }, [selectedCurrency]);

  useEffect(() => {
    setData(buildData(metal, selectedCurrency));
  }, [selectedCurrency, metal]);

  return (
    <View style={{ marginHorizontal: 8 }}>
      <Table header={headers} rows={data} />
    </View>
  );
};
