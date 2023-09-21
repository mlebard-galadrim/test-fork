import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { UseSummary } from "../../../hooks/useSummary";
import colors from "../../../themes/colors.theme";
import { SectionTitle } from "../../generic/section-title.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import ResumeComponent from "../coin-and-bar/resume-component";

export default function CoinBarSectionComponent() {
  const navigation = useNavigation();
  const { summary, userCurrency } = UseSummary();

  return (
    <View>
      <View style={styles.title}>
        <SectionTitle i18nKey="profile.dashboard.coin_and_bar" mb={0} />

        <TouchableOpacity style={{ justifyContent: "center" }} onPress={() => navigation.navigate("CoinAndBarScreen")}>
          <GoldBrokerText i18nKey="profile.dashboard.seemore" ssp color={colors.gold} fontSize={16} />
        </TouchableOpacity>
      </View>
      {summary.length > 0 ? (
        <ResumeComponent notitle summary={summary} />
      ) : (
        <View style={{ backgroundColor: colors.gray2, borderRadius: 2, padding: 16, marginHorizontal: 16, marginBottom: 26 }}>
          <GoldBrokerText i18nKey="profile.dashboard.emptyProducts" sspL left fontSize={16} ls color={colors.text.lightGray} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 26,
  },
});
