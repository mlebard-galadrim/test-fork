import React from "react";
import { Image, View } from "react-native";
import { Performance } from "../../../components/style/performance.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

export const Cell = ({ item }) => {
  return (
    <View
      style={{
        flex: item.flex ?? 1,
        alignItems: item.center ? "center" : "flex-start",
      }}
    >
      {item.type === "icon" && <Image source={item.source} />}
      {item.type === "text" && <GoldBrokerText sspL fontSize={17} value={item.value} />}
      {item.type === "bold-text" && <GoldBrokerText ssp fontSize={17} value={item.value} />}
      {item.type === "performance" && <Performance performance={item.value} size={15} />}
      {item.type === "header-text" && <GoldBrokerText sspL ls color={"rgba(255,255,255,0.6)"} i18nKey={item.value} fontSize={16} />}
      {item.type === "blank" && <View></View>}
    </View>
  );
};
