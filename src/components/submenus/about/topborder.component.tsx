import React from "react";
import { View } from "react-native";
import colors from "../../../themes/colors.theme";

export const TopBorder = () => {
  return (
    <View
      style={{ borderWidth: 1, borderColor: colors.gold, width: "50%" }}
    ></View>
  );
};
