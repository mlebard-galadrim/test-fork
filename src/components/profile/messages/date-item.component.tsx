import { GoldBrokerText } from "../../style/goldbroker-text.component";
import React from "react";
import { State } from "../../../store/configure.store";
import { View } from "react-native";
import colors from "../../../themes/colors.theme";
import { convertTZ } from "../../../utils/date.utils";
import { useSelector } from "react-redux";
export default function DateItemComponent({ date }) {
  const timezone = useSelector((state: State) => state.appStore.timezone);
  const locale = useSelector((state: State) => state.appStore.locale);

  const formatedDate = convertTZ(date, timezone, locale);
  return (
    <View
      style={{
        paddingLeft: 16,
        paddingVertical: 10,
        backgroundColor: colors.dark,
      }}
    >
      <GoldBrokerText
        left
        value={formatedDate}
        sspL
        fontSize={12}
        color={colors.transparent5}
      />
    </View>
  );
}
