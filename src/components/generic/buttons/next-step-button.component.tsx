import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

type NextStepButtonProps = {
  active: Boolean;
  onPress: () => void;
};
const nextStepInactive = require("../../../../assets/icons/register/icons-actions-step-inactif.png");
const nextStepActive = require("../../../../assets/icons/register/icons-actions-step-suivant.png");

export const NextStepButton = ({ active, onPress }) => {
  return (
    <View style={styles.nextStepContainer}>
      <TouchableOpacity disabled={!active} style={{ marginBottom: 16 }} onPress={onPress}>
        <Image source={active ? nextStepActive : nextStepInactive} style={styles.nextStepIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  nextStepContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  nextStepIcon: {
    width: 62,
    height: 62,
    marginRight: 16,
    borderRadius: 30,
    alignSelf: "flex-end",
  },
});
