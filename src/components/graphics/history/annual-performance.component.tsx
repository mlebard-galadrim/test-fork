import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import ChartsDataSlice from "../../../store/slices/chartsData.slice";
import colors from "../../../themes/colors.theme";
import { SectionTitle } from "../../generic/section-title.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { Table } from "../tables/table.component";

const tripleCurrencies = [
  ["EUR", "USD", "GBP"],
  ["CHF", "CAD", "AUD"],
  ["CNY", "JPY", "INR"],
];

const buildHeaders = (currencies) => {
  return [
    {
      type: "blank",
      flex: 0.5,
    },
    {
      type: "header-text",
      value: `currencies.${currencies[0]}`,
    },
    {
      type: "header-text",
      value: `currencies.${currencies[1]}`,
    },
    {
      type: "header-text",
      value: `currencies.${currencies[2]}`,
    },
  ];
};

const buildData = (data, currencies) => {
  if (Object.keys(data).length > 0 && currencies) {
    const rows = {};

    data.map((currencyData) => {
      let currency = currencyData.currency;
      let items = currencyData.items;
      items.map((item) => {
        rows[item.year] = {
          ...rows[item.year],
          [currency]: item.performance || "N/A",
        };
      });
    });

    const formatedData = Object.keys(rows).map((year) => {
      return [
        {
          type: "text",
          value: year,
          flex: 0.5,
        },
        {
          type: "performance",
          value: rows[year][currencies[0]],
        },
        {
          type: "performance",
          value: rows[year][currencies[1]],
        },
        {
          type: "performance",
          value: rows[year][currencies[1]],
        },
      ];
    });
    return formatedData;
  } else {
    return [];
  }
};

export const AnnualPerformance = () => {
  const [currentCurrencies, setCurrentCurrencies] = useState(tripleCurrencies[0]);
  const [formatedData, setFormatedData] = useState([]);
  const [headers, setHeaders] = useState(buildHeaders(currentCurrencies));
  const { annualPerformance } = useSelector((state: State) => state.chartDataStore);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(ChartsDataSlice.actions.setTripleCurrencies(currentCurrencies));
    setHeaders(buildHeaders(currentCurrencies));
  }, [currentCurrencies]);

  useEffect(() => {
    setFormatedData(buildData(annualPerformance, currentCurrencies));
  }, [annualPerformance]);

  if (Object.keys(annualPerformance).length === 0) {
    return null;
  }

  return (
    <View>
      <View style={{ marginHorizontal: 8 }}>
        <SectionTitle i18nKey="charts.history.annual_performance.title" fontSize={27} mb={16} />
        <View style={styles().metalSelectionBar}>
          {tripleCurrencies.map((triple, key) => {
            return (
              <TouchableOpacity
                style={styles(triple === currentCurrencies).metalButton}
                key={key}
                onPress={() => {
                  setCurrentCurrencies(triple);
                }}
              >
                {triple.map((currency, key) => {
                  return (
                    <View style={{ flexDirection: "row" }} key={key}>
                      {key !== 0 && (
                        <GoldBrokerText
                          color={currentCurrencies.includes(currency) ? colors.black : colors.text.gray}
                          ssp
                          mh={2}
                          fontSize={12}
                          value={"|"}
                        />
                      )}

                      <GoldBrokerText
                        color={currentCurrencies.includes(currency) ? colors.black : colors.text.gray}
                        value={currency}
                        fontSize={16}
                        ssp
                      />
                    </View>
                  );
                })}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <Table header={headers} rows={formatedData} mt={0} />
    </View>
  );
};

const styles = (active?) =>
  StyleSheet.create({
    metalSelectionBar: {
      marginBottom: 16,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: colors.lightDark,
      alignItems: "center",
      borderRadius: 4,
    },
    metalButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 10,
      margin: 3,
      backgroundColor: active ? colors.gold : undefined,
      borderRadius: 4,
    },
  });
