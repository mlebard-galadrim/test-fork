import React from "react";
import { View } from "react-native";
import { GoldBrokerText } from "../style/goldbroker-text.component";

export const Title = ({ title }) => {
  return (
    <View
      style={{
        position: "absolute",
        top: 8,
        width: "100%",
        alignItems: "center",
        zIndex: -1,
      }}
    >
      <GoldBrokerText i18nKey={title} fontSize={30} />
    </View>
  );
};
