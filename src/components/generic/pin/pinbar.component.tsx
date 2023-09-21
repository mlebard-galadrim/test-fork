import React from "react";
import { View } from "react-native";
import colors from "../../../themes/colors.theme";

export const PinBar = ({ pin }) => {
  return (
    <View
      style={{
        flex: 0.2,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          backgroundColor: pin.length >= 1 ? colors.gold : colors.white,
          borderRadius: 15,
          width: 14,
          height: 14,
          marginRight: 17,
        }}
      />
      <View
        style={{
          backgroundColor: pin.length >= 2 ? colors.gold : colors.white,
          borderRadius: 15,
          width: 14,
          height: 14,
          marginRight: 17,
        }}
      />
      <View
        style={{
          backgroundColor: pin.length >= 3 ? colors.gold : colors.white,
          borderRadius: 15,
          width: 14,
          height: 14,
          marginRight: 17,
        }}
      />
      <View
        style={{
          backgroundColor: pin.length >= 4 ? colors.gold : colors.white,
          borderRadius: 15,
          width: 14,
          height: 14,
        }}
      />
    </View>
  );
};
