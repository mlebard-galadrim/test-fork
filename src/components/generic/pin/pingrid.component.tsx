import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { GoldBrokerText } from "../../style/goldbroker-text.component";
import React from "react";
import colors from "../../../themes/colors.theme";

const deleteIcon = require("../../../../assets/icons/register/icons-keyboard-delete-left.png");

const PinNumber = ({ number, pin, setPin }) => {
  return (
    <TouchableOpacity
      style={styles.pinNumber}
      onPress={() => pin.length < 4 && setPin(pin.concat(number))}
    >
      <GoldBrokerText ssp black fontSize={32} value={number} />
    </TouchableOpacity>
  );
};

const Erase = ({ pin, setPin }) => {
  return (
    <TouchableOpacity
      style={styles.eraseButton}
      onPress={() => {
        setPin(pin.slice(0, -1));
      }}
    >
      <Image source={deleteIcon} style={{ width: 42, height: 28 }} />
    </TouchableOpacity>
  );
};

export const PinGrid = ({ pin, setPin }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <PinNumber number={1} pin={pin} setPin={setPin} />
        <PinNumber number={2} pin={pin} setPin={setPin} />
        <PinNumber number={3} pin={pin} setPin={setPin} />
      </View>
      <View style={styles.row}>
        <PinNumber number={4} pin={pin} setPin={setPin} />
        <PinNumber number={5} pin={pin} setPin={setPin} />
        <PinNumber number={6} pin={pin} setPin={setPin} />
      </View>
      <View style={styles.row}>
        <PinNumber number={7} pin={pin} setPin={setPin} />
        <PinNumber number={8} pin={pin} setPin={setPin} />
        <PinNumber number={9} pin={pin} setPin={setPin} />
      </View>
      <View style={styles.finaleRow}>
        <PinNumber number={0} pin={pin} setPin={setPin} />
        <Erase pin={pin} setPin={setPin} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-evenly",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 24,
  },
  finaleRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  pinNumber: {
    marginHorizontal: 16,
    width: 72,
    height: 72,
    backgroundColor: colors.white,
    borderColor: colors.gold,
    borderRadius: 36,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  eraseButton: {
    width: 72,
    height: 72,
    marginHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
