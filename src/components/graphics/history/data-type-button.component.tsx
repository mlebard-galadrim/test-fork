import { TouchableOpacity, View } from "react-native";

import { GoldBrokerText } from "../../style/goldbroker-text.component";
import React from "react";
import colors from "../../../themes/colors.theme";

export const DataTypeButton = ({ title, display, setDisplay, color }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setDisplay(!display);
      }}
      style={{ flexDirection: "row", alignItems: "center" }}
    >
      <View
        style={{
          height: 16,
          width: 16,
          backgroundColor: display ? color : colors.gray,
          borderRadius: 8,
          marginRight: 8,
        }}
      />
      <GoldBrokerText
        color={display ? colors.white : colors.gray}
        i18nKey={title}
        ssp
        fontSize={12}
      />
    </TouchableOpacity>
  );
};
