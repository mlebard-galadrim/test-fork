import { CheckBox } from "../generic/checkbox.component";
import { GoldBrokerText } from "../style/goldbroker-text.component";
import React from "react";
import { TouchableOpacity } from "react-native";
import colors from "../../themes/colors.theme";
import { useApiItem } from "./useApiItem";

export const ApiFilterItem = ({ value, id, action, filters, type }) => {
  const { onFilterPress, checked } = useApiItem({
    id,
    type,
    filters,
    action,
  });

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 16,
      }}
      onPress={onFilterPress}
    >
      <GoldBrokerText
        ssp
        fontSize={18}
        left
        flex
        color={checked() ? colors.gold : undefined}
        value={value}
      />
      <CheckBox checked={checked()} />
    </TouchableOpacity>
  );
};
