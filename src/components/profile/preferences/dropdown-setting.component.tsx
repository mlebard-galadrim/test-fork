import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";

import { GoldBrokerText } from "../../style/goldbroker-text.component";
import Icon from "react-native-vector-icons/Octicons";
import colors from "../../../themes/colors.theme";

type DropdownSettingProps = {
  title: string;
  choices: string[];
  choice: string;
  setChoice: (arg1: string) => void;
};

export const DropdownSetting = ({
  title,
  choices,
  choice,
  setChoice,
}: DropdownSettingProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <View
      style={{
        marginHorizontal: 18,
        marginBottom: 24,
        zIndex: showDropdown ? 100 : -100,
      }}
    >
      <View style={{ alignItems: "flex-start" }}>
        <GoldBrokerText
          ssp
          value={title}
          fontSize={14}
          color={colors.light}
          mb={8}
        />
      </View>
      <TouchableOpacity
        style={styles().dropdownContainer}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <GoldBrokerText value={choice} fontSize={17} color={colors.black} ssp />
        <Icon name="triangle-down" size={20} style={{ color: colors.black }} />
        {showDropdown && (
          <View style={styles().dropdown}>
            <FlatList
              data={choices}
              keyExtractor={(choice) => choice}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    borderTopColor: colors.gray,
                    borderTopWidth: 1,
                  }}
                  onPress={() => {
                    setChoice(item);
                    setShowDropdown(false);
                  }}
                >
                  <GoldBrokerText
                    value={item}
                    color={colors.black}
                    ssp
                    fontSize={17}
                    mb={10}
                    mt={10}
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = () =>
  StyleSheet.create({
    dropdownContainer: {
      flexDirection: "row",
      backgroundColor: colors.white,
      borderRadius: 4,
      justifyContent: "space-between",
      height: 50,
      alignItems: "center",
      paddingHorizontal: 20,
    },
    dropdown: {
      position: "absolute",
      top: 50,
      left: 0,
      right: 0,
      maxHeight: 300,
      backgroundColor: colors.white,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.black,
    },
  });
