import React from "react";
import { Text, View } from "react-native";
import colors from "../../../themes/colors.theme";
import { formatCurrency } from "../../../utils/currencies.utils";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { Performance } from "../../style/performance.component";

export default function FooterComponent({ totalSummary, currentMetal, userCurrency }) {
  if (!totalSummary.metals[currentMetal]) {
    return (
      <View style={{ marginVertical: 18 }}>
        <Text>
          <GoldBrokerText sspL i18nKey={"profile.coin_and_bar.noproduct"} />
          <GoldBrokerText sspL value={" "} />
          <GoldBrokerText sspL i18nKey={`metals.${currentMetal}`} />
        </Text>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 63, marginHorizontal: 20 }}>
      <Text>
        <GoldBrokerText left i18nKey={`profile.coin_and_bar.total.title.${currentMetal}`} sspB fontSize={18} />
        <GoldBrokerText value={` (${totalSummary.ounces} onces)`} ssp fontSize={14} color={colors.transparent5} />
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <View>
          <GoldBrokerText left i18nKey="profile.coin_and_bar.total.purchaseValue" fontSize={12} sspL color={colors.transparent5} />
          <GoldBrokerText value={formatCurrency(userCurrency, totalSummary.metals[currentMetal].purchaseValue.toFixed(2))} fontSize={18} ssp left />
        </View>
        <View>
          <GoldBrokerText left i18nKey="profile.coin_and_bar.total.currentValue" fontSize={12} sspL color={colors.transparent5} />
          <GoldBrokerText value={formatCurrency(userCurrency, totalSummary.metals[currentMetal].currentValue.toFixed(2))} fontSize={18} ssp left />
        </View>
        <View>
          <GoldBrokerText left i18nKey="profile.coin_and_bar.total.performance" fontSize={12} sspL color={colors.transparent5} />
          <Performance performance={totalSummary.metals[currentMetal].performance.toFixed(2)} />
        </View>
      </View>
    </View>
  );
}
