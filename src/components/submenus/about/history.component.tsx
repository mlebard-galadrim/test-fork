import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { TopBorder } from "./topborder.component";

const bgimage = require("../../../../assets/background-images/history-background.png");

export const HistoryBlock = () => {
  return (
    <ImageBackground
      source={bgimage}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 18,
      }}
    >
      <TopBorder />
      <View style={styles.container}>
        <GoldBrokerText i18nKey={"leftMenu.submenus.about.history.title"} fontSize={32} mt={32} mb={32} />
        <GoldBrokerText
          i18nKey={"leftMenu.submenus.about.history.content"}
          justify
          flex
          ssp
          fontSize={17}
          ml={10}
          mr={10}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
    paddingLeft: 16,
    paddingBottom: 32,
    alignItems: "center",
  },
});
