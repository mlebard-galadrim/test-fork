import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { UseMessage } from "../../../screens/bottom-tabs/profile/menu/messages/useMessage";
import colors from "../../../themes/colors.theme";
import { SeeMoreButton } from "../../generic/buttons/see-more-button.component";
import { SectionTitle } from "../../generic/section-title.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import MessageListItemComponent from "../messages/message-list-item.component";

export default function MessageSectionComponent() {
  const navigation = useNavigation();

  const { inboxMessage } = UseMessage();

  return (
    <View style={{ marginBottom: 55 }}>
      <View style={styles.title}>
        <SectionTitle i18nKey="profile.dashboard.messages" mb={0} />

        <TouchableOpacity onPress={() => navigation.navigate("MessagesScreen")}>
          <GoldBrokerText i18nKey="profile.dashboard.seemore" ssp color={colors.gold} fontSize={16} />
        </TouchableOpacity>
      </View>
      {inboxMessage.length > 0 ? (
        inboxMessage.slice(0, 3).map((message, index) => <MessageListItemComponent key={`message-list-${index}`} message={message} />)
      ) : (
        <View style={{ backgroundColor: colors.gray2, borderRadius: 2, padding: 16, marginHorizontal: 16 }}>
          <GoldBrokerText i18nKey="profile.dashboard.emptyMessages" sspL left fontSize={16} ls color={colors.text.lightGray} />
        </View>
      )}
      <SeeMoreButton i18nKey={"profile.dashboard.new_message"} onPress={() => navigation.navigate("NewMessageScreen")} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginTop: 20,
    marginHorizontal: 34,
    borderRadius: 50,
    borderColor: colors.gold,
    borderWidth: 1,
    alignItems: "center",
    padding: 12,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 26,
  },
});
