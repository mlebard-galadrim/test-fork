import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { GoldBrokerText } from "../../style/goldbroker-text.component";
import React from "react";
import colors from "../../../themes/colors.theme";

const receptionIcon = require("../../../../assets/icons/profile/reception.png");
const sendIcon = require("../../../../assets/icons/profile/icons-espace-client-send-black.png");

export default function MessageCategoryComponent({ selected, setSelected }) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.gray2,
        borderRadius: 4,
        overflow: "hidden",
        marginBottom: 24,
      }}
    >
      <TouchableOpacity
        style={styles(selected === "inbox").button}
        onPress={() => setSelected("inbox")}
      >
        <Image
          source={receptionIcon}
          style={styles(selected === "inbox").icon}
        />
        <GoldBrokerText
          i18nKey="profile.messages.reception"
          sspL
          color={selected === "inbox" ? colors.black : colors.text.lightGray}
          fontSize={14}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles(selected === "sent").button}
        onPress={() => setSelected("sent")}
      >
        <Image source={sendIcon} style={styles(selected === "sent").icon} />
        <GoldBrokerText
          i18nKey="profile.messages.sent"
          sspL
          color={selected === "sent" ? colors.black : colors.text.lightGray}
          fontSize={14}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = (selected) =>
  StyleSheet.create({
    button: {
      flex: 1,
      paddingVertical: 12,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: selected ? colors.gold : undefined,
    },
    icon: {
      width: 14,
      height: 14,
      marginRight: 12,
      tintColor: selected ? colors.black : colors.text.lightGray,
    },
  });
