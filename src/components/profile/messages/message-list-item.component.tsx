import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import colors from "../../../themes/colors.theme";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

export default function MessageListItemComponent({ message }) {
  const navigation = useNavigation();
  const { is_read } = message;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        navigation.navigate("ThreadScreen", {
          threadId: message.id,
          subject: message.subject,
        });
      }}
    >
      <View style={styles.row}>
        {!is_read && <View style={styles.redDot} />}
        <GoldBrokerText sspB={!is_read} left flex value={message.subject} ssp={is_read} fontSize={16} color={colors.gold} />
      </View>
      <GoldBrokerText left value={"Or-fr Team"} ssp fontSize={16} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray2,
    justifyContent: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },
  redDot: {
    width: 12,
    height: 12,
    backgroundColor: "#ed5454",
    borderRadius: 6,
    marginRight: 12,
  },
});
