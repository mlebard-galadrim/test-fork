import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TopBar } from "../../../../../components/generic/top-bar.component";

export const BalanceScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            navigation.goBack();
          },
        }}
        middle={{
          type: "rawtext",
          title: "Balance",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
