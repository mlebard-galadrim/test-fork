import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { RatioFilter } from "./ratio-filter.component";
import { RatioGraph } from "./ratio-graph.component";
import { SectionTitle } from "../../generic/section-title.component";
import colors from "../../../themes/colors.theme";
import { getFromTo } from "../../../utils/date.utils";
import { getHistoricalCollectionRatio } from "../../../services/historical.service";
import { metalsConstant } from "../../../constants/metals.constant";

export const Ratios = ({ currentMetal, comparedMetal, setComparedMetal }) => {
  const [data, setData] = useState([]);
  const [from, to] = getFromTo(5);
  const [lowerDate, setLowerDate] = useState(from);
  const [higherDate, setHigherDate] = useState(to);

  useEffect(() => {
    if (lowerDate === higherDate) {
      getHistoricalCollectionRatio(currentMetal, comparedMetal).then((r) => {
        setData(r["_embedded"]["items"]);
      });
    } else {
      getHistoricalCollectionRatio(
        currentMetal,
        comparedMetal,
        lowerDate,
        higherDate
      ).then((r) => {
        setData(r["_embedded"]["items"]);
      });
    }
  }, [currentMetal, comparedMetal, lowerDate, higherDate]);
  return (
    <View style={{ marginBottom: 16, marginTop: 32 }}>
      <View style={{ marginHorizontal: 8 }}>
        <SectionTitle i18nKey="charts.ratios.title" fontSize={27} mb={16} />
        <View style={styles().metalSelectionBar}>
          {metalsConstant.map((metal, key) => {
            return (
              metal.id !== currentMetal && (
                <TouchableOpacity
                  style={styles(metal.id, comparedMetal).metalButton}
                  key={key}
                  onPress={() => {
                    setComparedMetal(metal.id);
                  }}
                >
                  <GoldBrokerText
                    color={
                      metal.id === comparedMetal
                        ? colors.dark
                        : colors.text.gray
                    }
                    i18nKey={`metals.${currentMetal}`}
                    fontSize={14}
                    ssp
                  />
                  <GoldBrokerText
                    color={
                      metal.id === comparedMetal
                        ? colors.dark
                        : colors.text.gray
                    }
                    value="/"
                    fontSize={14}
                    ssp
                  />
                  <GoldBrokerText
                    color={
                      metal.id === comparedMetal
                        ? colors.dark
                        : colors.text.gray
                    }
                    i18nKey={metal.name}
                    fontSize={14}
                    ssp
                  />
                </TouchableOpacity>
              )
            );
          })}
        </View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 23,
            alignItems: "center",
          }}
        >
          <GoldBrokerText
            sspB
            value={data.length > 0 ? data[data.length - 1].close.toFixed(2) : 0}
            mr={18}
            fontSize={28}
          />
        </View>
      </View>
      <RatioGraph data={data} />
      <RatioFilter
        lowerDate={lowerDate}
        setLowerDate={setLowerDate}
        higherDate={higherDate}
        setHigherDate={setHigherDate}
      />
      {/* <ZoomBar /> */}
    </View>
  );
};

const styles = (metal?, currentMetal?) =>
  StyleSheet.create({
    metalSelectionBar: {
      marginBottom: 24,
      flexDirection: "row",
      backgroundColor: colors.lightDark,
      alignItems: "center",
      borderRadius: 4,
    },
    metalButton: {
      flexDirection: "row",
      flex: 1,
      justifyContent: "center",
      paddingVertical: 10,
      margin: 3,
      backgroundColor: metal === currentMetal ? colors.gold : undefined,
      borderRadius: 4,
    },
  });
