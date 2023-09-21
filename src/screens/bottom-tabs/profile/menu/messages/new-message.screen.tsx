import React from "react";
import { View } from "react-native";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import NewMessageComponent from "../../../../../components/profile/messages/new-message-form.component";

export const NewMessageScreen = ({ route, navigation }) => {
  const { message } = route.params ?? {};

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            navigation.goBack();
          },
        }}
        middle={{
          type: "text",
          title: "profile.new_message.title",
        }}
        mb={0}
      />
      <NewMessageComponent automaticMessage={message} />
    </View>
  );
};
