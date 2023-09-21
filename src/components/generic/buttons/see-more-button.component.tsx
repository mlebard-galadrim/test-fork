import { StyleSheet, TouchableOpacity, View } from "react-native";

import { GoldBrokerText } from "../../style/goldbroker-text.component";
import React from "react";
import colors from "../../../themes/colors.theme";

export const SeeMoreButton = ({ i18nKey, onPress }) => {
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
        <GoldBrokerText
          fontSize={18}
          i18nKey={i18nKey}
          ssp
          color={colors.gold}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    width: 215,
    marginTop: 20,
    borderRadius: 50,
    borderColor: colors.gold,
    borderWidth: 1,
    alignItems: "center",
    padding: 12,
  },
});
