import React from "react";
import { View } from "react-native";
import colors from "../../themes/colors.theme";

export const ProgressBar = ({ progress }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        borderRadius: 10,
        justifyContent: "center",
        marginHorizontal: 10,
        backgroundColor: colors.white,
      }}
    >
      <View
        style={{
          borderRadius: 10,
          borderWidth: 2,
          borderColor: colors.gold,
          flex: progress,
        }}
      />
      <View
        style={{
          borderRadius: 10,
          borderWidth: 2,
          borderColor: colors.white,
          flex: 1 - progress,
        }}
      />
    </View>
  );
};
