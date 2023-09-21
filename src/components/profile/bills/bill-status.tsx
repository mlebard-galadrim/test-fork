import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import colors from "../../../themes/colors.theme";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

export const BillStatus = ({ status, name, payable }) => {
  let backgroundColor: string, color: string, icon: ImageSourcePropType;

  switch (status) {
    case "1":
      icon = require("../../../../assets/icons/profile/status/icons-espace-client-check.png");
      backgroundColor = "rgba(84,187,131,0.1)";
      color = colors.text.green;
      break;
    case "2":
      icon = require("../../../../assets/icons/profile/status/icons-espace-client-wait.png");
      backgroundColor = "rgba(255,141,35,0.1)";
      color = colors.text.orange;
      break;
    case "3":
      icon = require("../../../../assets/icons/profile/status/icons-espace-client-check.png");
      backgroundColor = "rgba(84,187,131,0.1)";
      color = colors.text.green;
      break;
    case "4":
      icon = require("../../../../assets/icons/profile/status/icons-espace-client-alert.png");
      backgroundColor = "rgba(237, 84, 84, 0.1)";
      color = colors.text.red;
      break;
    case "5":
      icon = require("../../../../assets/icons/profile/status/icons-espace-client-alert.png");
      backgroundColor = "rgba(237, 84, 84, 0.1)";
      color = colors.text.red;
      break;
    default:
      icon = require("../../../../assets/icons/profile/status/icons-espace-client-alert.png");
      backgroundColor = "rgba(237, 84, 84, 0.1)";
      color = colors.text.red;
      break;
  }

  if (payable) {
    return (
      <View style={styles(colors.lightDark).payContainer}>
        <Icon
          name="money-check"
          size={12}
          style={{
            width: 17,
            height: 12,
            marginRight: 12,
            color: colors.gold,
          }}
        />
        <GoldBrokerText i18nKey={"profile.bills.pay"} fontSize={16} sspL color={colors.gold} />
      </View>
    );
  }
  return (
    <View style={styles(backgroundColor).container}>
      <Image source={icon} style={{ width: 17, height: 17, marginRight: 12 }} />
      <GoldBrokerText value={name} fontSize={16} sspL color={color} />
    </View>
  );
};

const styles = (backgroundColor) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignSelf: "flex-end",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 18,
      backgroundColor,
    },
    payContainer: {
      flexDirection: "row",
      alignSelf: "flex-end",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 18,
      backgroundColor,
      borderWidth: 1,
      borderColor: colors.gold,
      borderRadius: 4,
    },
  });
};
