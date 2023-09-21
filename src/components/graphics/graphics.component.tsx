import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { metalsConstant } from "../../constants/metals.constant";
import { State } from "../../store/configure.store";
import colors from "../../themes/colors.theme";
import { SectionTitle } from "../generic/section-title.component";
import { GoldBrokerText } from "../style/goldbroker-text.component";
import { GraphicPrice } from "./direct/graphic-price.component";
import { MetalPriceGraphic } from "./direct/metal-price-graphic.component";
import { AnnualPerformance } from "./history/annual-performance.component";
import { ClosingPrice } from "./history/closing-price.component";
import { GraphicRatio } from "./history/graphic-ratio.component";
import { MetalHistoryGraphic } from "./history/metal-history-graphic.component";
import { OncePrice } from "./history/once-price.component";

export const Graphics = ({ metal, currentMetal, setCurrentMetal }) => {
  // const [comparedMetal, setComparedMetal] = useState("XAG");
  const [globalPerformance, setGlobalPerformance] = useState(0);
  const { metalPriceGraphic } = useSelector((state: State) => state.chartDataStore);
  const [performancesHistory, setPerformancesHistory] = useState({});
  const [epoch, setEpoch] = useState("direct");
  useEffect(() => {
    setCurrentMetal(metal);
  }, [metal]);

  return (
    <View style={styles().container}>
      <View style={{ marginHorizontal: 8 }}>
        <SectionTitle i18nKey="charts.graphics.title" fontSize={27} mb={16} />
        <View style={styles().metalSelectionBar}>
          {metalsConstant.map((metal, key) => {
            return (
              <TouchableOpacity
                style={styles(metal.id === currentMetal).metalButton}
                key={key}
                onPress={() => {
                  setCurrentMetal(metal.id);
                }}
              >
                <GoldBrokerText color={metal.id === currentMetal ? colors.dark : colors.text.gray} i18nKey={metal.name} fontSize={16} ssp />
              </TouchableOpacity>
            );
          })}
        </View>

        {epoch === "direct" ? <GraphicPrice currentMetal={currentMetal} /> : null}
        {epoch === "history" ? <GraphicRatio globalPerformance={globalPerformance} /> : null}

        <View style={{ marginTop: 16 }}>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity style={styles(epoch === "direct").epochButton} onPress={() => setEpoch("direct")}>
              <GoldBrokerText ssp i18nKey="charts.direct.title" ls color={epoch === "direct" ? colors.white : colors.gray} />
            </TouchableOpacity>
            <TouchableOpacity style={styles(epoch === "history").epochButton} onPress={() => setEpoch("history")}>
              <GoldBrokerText ssp i18nKey="charts.history.title" ls color={epoch === "history" ? colors.white : colors.gray} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {epoch === "direct" && (
        <View>
          <MetalPriceGraphic data={metalPriceGraphic} />
          {/* <TodayPrice metal={currentMetal} /> */}
        </View>
      )}
      {epoch === "history" && (
        <View>
          <MetalHistoryGraphic
            currentMetal={currentMetal}
            setGlobalPerformance={setGlobalPerformance}
            setPerformancesHistory={setPerformancesHistory}
          />
          <OncePrice performancesHistory={performancesHistory} />
          <ClosingPrice currentMetal={currentMetal} />
          <AnnualPerformance />
        </View>
      )}
      {/* <Ratios currentMetal={currentMetal} comparedMetal={comparedMetal} setComparedMetal={setComparedMetal} /> */}
    </View>
  );
};

const styles = (active?) =>
  StyleSheet.create({
    container: {
      marginTop: 32,
      marginHorizontal: 8,
    },
    metalSelectionBar: {
      marginBottom: 32,
      flexDirection: "row",
      backgroundColor: colors.lightDark,
      alignItems: "center",
      borderRadius: 4,
    },
    metalButton: {
      flex: 1,
      paddingVertical: 10,
      margin: 3,
      backgroundColor: active ? colors.gold : undefined,
      borderRadius: 4,
    },
    epochButton: {
      borderWidth: 1,
      borderColor: active ? colors.gold : colors.gray,
      backgroundColor: active ? colors.lightDark : undefined,
      marginHorizontal: 4,
      padding: 9,
      borderRadius: 4,
    },
  });
