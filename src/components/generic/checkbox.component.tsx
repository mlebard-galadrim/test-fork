import React from "react";
import { View } from "react-native";
import colors from "../../themes/colors.theme";

type CheckBoxProps = {
  checked: boolean;
  round?: boolean;
};
export const CheckBox = ({ checked, round }: CheckBoxProps) => {
  return (
    <View
      style={{
        height: 24,
        width: 24,
        borderRadius: round ? 12 : 5,
        backgroundColor: colors.dark,
        borderColor: colors.gray,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {checked && <View style={{ height: 18, width: 18, borderRadius: round ? 9 : 4, backgroundColor: colors.gold }} />}
    </View>
  );
};
