import React from "react";
import { View } from "react-native";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import MessageCategoryComponent from "../../../../../components/profile/messages/message-category.component";
import { MessageListComponent } from "../../../../../components/profile/messages/message-list.component";
import { UseMessage } from "./useMessage";

const plusIcon = require("../../../../../../assets/icons/profile/icons-espace-client-plus.png");

export const MessagesScreen = () => {
  const { navigation, selected, setSelected, loadMessages, inboxMessage, sentMessage } = UseMessage();

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "three-bars",
          function: () => {
            navigation.navigate("SideMenuScreen");
          },
        }}
        middle={{
          type: "text",
          title: "profile.menu.messages",
        }}
        right={{
          type: "buttonImage",
          source: plusIcon,
          function: () => {
            navigation.navigate("NewMessageScreen");
          },
        }}
      />
      <View style={{ marginHorizontal: 16, flex: 1 }}>
        <MessageCategoryComponent selected={selected} setSelected={setSelected} />
        {selected === "inbox" ? (
          <MessageListComponent messages={inboxMessage} loadMessages={loadMessages} />
        ) : (
          <MessageListComponent messages={sentMessage} loadMessages={loadMessages} />
        )}
      </View>
    </View>
  );
};
