import { StyleSheet, TouchableOpacity, View } from "react-native";

import { GoldBrokerText } from "../style/goldbroker-text.component";
import React from "react";
import colors from "../../themes/colors.theme";

export const TabBlock = ({ focus, setFocus }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={styles(focus === "contact").tab}
        onPress={() => {
          setFocus("contact");
        }}
      >
        <GoldBrokerText
          sspM={focus === "contact"}
          ssp={!(focus === "contact")}
          color={focus === "contact" ? colors.gold : colors.light}
          fontSize={17}
          i18nKey="contactUs.tabs.contactUs"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles(focus === "message").tab}
        onPress={() => {
          setFocus("message");
        }}
      >
        <GoldBrokerText
          sspM={focus === "message"}
          ssp={!(focus === "message")}
          color={focus === "message" ? colors.gold : colors.light}
          fontSize={17}
          i18nKey="contactUs.tabs.securedMessaging"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = (focused) =>
  StyleSheet.create({
    tab: {
      flex: 1,
      height: "100%",
      borderBottomWidth: 2,
      borderBottomColor: focused ? colors.gold : colors.gray,
    },
  });
