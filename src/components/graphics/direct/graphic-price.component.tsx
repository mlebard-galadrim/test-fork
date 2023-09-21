import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { metalsConstant } from "../../../constants/metals.constant";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { formatCurrency } from "../../../utils/currencies.utils";
import { loadUnitsPrices } from "../../../utils/data.utils";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { Performance } from "../../style/performance.component";

const initialMetalState = {
  XAU: {},
  XAG: {},
  XPT: {},
  XPD: {},
};

export const GraphicPrice = ({ currentMetal }) => {
  const [metals, setMetals] = useState(initialMetalState);
  const { selectedCurrency } = useSelector((state: State) => state.dataStore);

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
    setMetals(newMetalObject);
  };

  useEffect(() => {
    loadMetal();
  }, [selectedCurrency]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 23,
          alignItems: "center",
        }}
      >
        <GoldBrokerText
          sspB
          value={formatCurrency(selectedCurrency, metals[currentMetal][selectedCurrency]?.oz.value.toFixed(2))}
          mr={18}
          fontSize={28}
        />
        <Performance performance={metals[currentMetal][selectedCurrency]?.oz.performance} />
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.gray,
        }}
      >
        <View
          style={{
            alignItems: "flex-start",
          }}
        >
          <GoldBrokerText ssp fontSize={14} color={colors.gray} value="1 kilogramme" />
          <GoldBrokerText ssp value={formatCurrency(selectedCurrency, metals[currentMetal][selectedCurrency]?.kg.value)} />
        </View>
        <View
          style={{
            borderRightWidth: 1,
            borderRightColor: colors.gray,
            marginHorizontal: 17,
          }}
        />
        <View style={{ alignItems: "flex-start" }}>
          <GoldBrokerText ssp fontSize={14} color={colors.gray} value="1 gramme" mr={18} />
          <GoldBrokerText ssp value={formatCurrency(selectedCurrency, metals[currentMetal][selectedCurrency]?.g.value)} />
        </View>
      </View>
    </>
  );
};
