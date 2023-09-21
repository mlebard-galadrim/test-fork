import { GoldBrokerText } from "../style/goldbroker-text.component";
import React from "react";
import { View } from "react-native";
import colors from "../../themes/colors.theme";

export const NewProduct = () => {
  return (
    <View
      style={{
        padding: 4,
        borderRadius: 5,
        backgroundColor: colors.gold,
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <GoldBrokerText
        fontSize={12}
        black
        sspM
        ls={1.5}
        i18nKey={"products.ribbon.new"}
      />
    </View>
  );
};
