import { CheckBox } from "../generic/checkbox.component";
import { GoldBrokerText } from "../style/goldbroker-text.component";
import React from "react";
import { TouchableOpacity } from "react-native";
import colors from "../../themes/colors.theme";
import { useItem } from "./useItem";

export const FilterItem = ({ id, i18nKey, action, filters, type }) => {
  const { onFilterPress, checked } = useItem({ id, action, filters, type });

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
        i18nKey={i18nKey}
        value={i18nKey}
      />
      <CheckBox checked={checked()} />
    </TouchableOpacity>
  );
};
