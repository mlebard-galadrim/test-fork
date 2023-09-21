import { StyleSheet, View } from "react-native";

import { GoldBrokerText } from "../style/goldbroker-text.component";
import React from "react";

export const TitleTextBlock = (props) => {
  return (
    <View style={styles.textView}>
      <GoldBrokerText i18nKey={props.i18nKeyTitle} fontSize={32} mb={24} />
      <GoldBrokerText i18nKey={props.i18nKeyBody} ssp fontSize={17} mb={24} />
    </View>
  );
};

const styles = StyleSheet.create({
  textView: {
    alignItems: "center",
    marginLeft: 16,
    marginRight: 16,
    flex: 1,
  },
});
