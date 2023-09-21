import React, { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import colors from "../../../themes/colors.theme";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import DateItemComponent from "./date-item.component";
import MessageListItemComponent from "./message-list-item.component";

type MessageListComponentProps = {
  messages: [];
};

export const MessageListComponent = ({ messages, loadMessages }) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    loadMessages();
    setRefreshing(false);
  };

  return (
    <FlatList
      ListEmptyComponent={
        <View style={{ backgroundColor: colors.gray2, borderRadius: 2, padding: 16 }}>
          <GoldBrokerText i18nKey="profile.messages.empty" sspL left fontSize={16} ls color={colors.text.lightGray} />
        </View>
      }
      refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={refreshing} tintColor={"white"} />}
      data={messages}
      keyExtractor={(item) => `message-list-${item.id}`}
      renderItem={({ item }) => (
        <>
          <DateItemComponent date={item.created_at} />
          <MessageListItemComponent message={item} />
        </>
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  );
};
