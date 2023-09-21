import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { GoldbrokerInput } from "../../style/goldbroker-input.component";
import React from "react";
import i18n from "i18n-js";
import { useNavigation } from "@react-navigation/native";

const filterIcon = require(`../../../../assets/icons/more/icons-menu-filter.png`);
const filterActiveIcon = require(`../../../../assets/icons/more/icons-menu-filter-on.png`);

export const Searchbar = ({ active, search, setSearch, filterScreen }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <GoldbrokerInput
          dark
          icon
          row
          padding={0}
          internPadding={8}
          radius={4}
          placeholder={i18n.t("searchbar")}
          onChange={setSearch}
          value={search}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(filterScreen);
        }}
      >
        <Image
          source={active ? filterActiveIcon : filterIcon}
          style={{ width: 24, height: 24, marginLeft: 16 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
});
