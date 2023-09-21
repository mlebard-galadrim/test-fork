import { Performance } from "../../style/performance.component";
import React from "react";
import { View } from "react-native";

export const GraphicRatio = ({ globalPerformance }) => {
  return (
    <View style={{ marginHorizontal: 8 }}>
      <Performance performance={globalPerformance.toFixed(2)} />
    </View>
  );
};
