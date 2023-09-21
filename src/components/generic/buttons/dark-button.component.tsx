import { StyleSheet, TouchableOpacity } from "react-native";

import { GoldBrokerText } from "../../style/goldbroker-text.component";
import React from "react";

type ButtonProps = {
  i18nKey: string;
  fontSize: number;
  flex: Boolean;
  onPress: () => void;
};

export const DarkButton = ({
  i18nKey,
  fontSize = 16,
  flex = false,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles(flex).buttonStyle} onPress={onPress}>
      <GoldBrokerText i18nKey={i18nKey} fontSize={fontSize ?? 16} sspM />
    </TouchableOpacity>
  );
};

const styles = (flex) =>
  StyleSheet.create({
    buttonStyle: {
      flex: flex ? 1 : 0,
      borderRadius: 50,
      backgroundColor: "rgba(254, 254, 253, 0.1)",
      padding: 10,
      margin: 5,
    },
  });
