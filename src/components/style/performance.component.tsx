import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import colors from "../../themes/colors.theme";
import { GoldBrokerText } from "./goldbroker-text.component";

const ChevronUp = (prop) => <Icon name="triangle-up" size={prop.size} style={{ color: colors.success }} />;

const ChevronDown = (prop) => <Icon name="triangle-down" size={prop.size} style={{ color: colors.danger }} />;

export const Performance = ({ performance, size = 16 }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {performance >= 0 ? <ChevronUp size={size} /> : <ChevronDown size={size} />}
      <GoldBrokerText
        value={performance ? `${performance.toString().replace("-", "")}%` : `0%`}
        ssp
        color={performance >= 0 ? colors.success : colors.danger}
        mr={16}
        ml={4}
        fontSize={size}
      />
    </View>
  );
};
