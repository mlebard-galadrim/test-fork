import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import colors from "../../../themes/colors.theme";
import { getFromTo } from "../../../utils/date.utils";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { DatePicker } from "./date-picker.component";

const ScaleButton = ({ title, period, setScale, scale, setManualMode, manualMode }) => {
  return (
    <TouchableOpacity
      style={styles(scale === period && !manualMode).scaleButton}
      onPress={() => {
        setScale(period);
        setManualMode(false);
      }}
    >
      <GoldBrokerText i18nKey={title} fontSize={18} ls color={scale === period && !manualMode ? colors.white : colors.gray} ssp />
    </TouchableOpacity>
  );
};

export const RatioFilter = ({ lowerDate, setLowerDate, higherDate, setHigherDate }) => {
  const [scale, setScale] = useState(0);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    const [from, to] = getFromTo(scale);
    setLowerDate(from);
    setHigherDate(to);
  }, [scale]);

  return (
    <View>
      <View style={styles().automaticScale}>

        <ScaleButton
          setScale={setScale}
          setManualMode={setManualMode}
          manualMode={manualMode}
          scale={scale}
          title={"charts.scale_filter.fiveDays"}
          period={5}
        />
        <ScaleButton
          setScale={setScale}
          setManualMode={setManualMode}
          manualMode={manualMode}
          scale={scale}
          title={"charts.scale_filter.oneMonth"}
          period={30}
        />
        <ScaleButton
          setScale={setScale}
          setManualMode={setManualMode}
          manualMode={manualMode}
          scale={scale}
          title={"charts.scale_filter.oneYear"}
          period={365}
        />
        <ScaleButton
          setScale={setScale}
          setManualMode={setManualMode}
          manualMode={manualMode}
          scale={scale}
          title={"charts.scale_filter.fiveYears"}
          period={1825}
        />
        <ScaleButton
          setScale={setScale}
          setManualMode={setManualMode}
          manualMode={manualMode}
          scale={scale}
          title={"charts.scale_filter.tenYears"}
          period={3650}
        />
        <ScaleButton
          setScale={setScale}
          setManualMode={setManualMode}
          manualMode={manualMode}
          scale={scale}
          title={"charts.scale_filter.all"}
          period={0}
        />
      </View>
      <View style={styles().manualScale}>
        <GoldBrokerText i18nKey={"charts.scale_filter.from"} ls fontSize={18} color={manualMode ? colors.white : colors.gray} ssp />
        <DatePicker lower bound={higherDate} date={lowerDate} setDate={setLowerDate} setManualMode={setManualMode} manualMode={manualMode} />
        <GoldBrokerText i18nKey={"charts.scale_filter.to"} ls fontSize={18} color={manualMode ? colors.white : colors.gray} ssp />
        <DatePicker bound={lowerDate} date={higherDate} setDate={setHigherDate} setManualMode={setManualMode} manualMode={manualMode} />
      </View>
    </View>
  );
};

const styles = (active?) =>
  StyleSheet.create({
    scaleButton: {
      borderWidth: 1,
      borderColor: active ? colors.gold : colors.gray,
      backgroundColor: active ? colors.lightDark : undefined,
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    automaticScale: {
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      alignItems: "center",
      
    },
    manualScale: {
      marginTop: 12,
      marginHorizontal: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      alignItems: "center",
    },
  });
