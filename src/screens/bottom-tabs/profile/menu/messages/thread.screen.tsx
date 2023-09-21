import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { useDispatch } from "react-redux";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import MessageItemComponent from "../../../../../components/profile/messages/message-item.component";
import ResponseMessageFormComponent from "../../../../../components/profile/messages/response-message-form.component";
import { getThread } from "../../../../../services/messages.service";
import UserSlice from "../../../../../store/slices/user.slice";

export default function ThreadScreen({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { threadId, subject } = route.params;
  const [shouldReloadThread, setShouldReloadThread] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    getThread(threadId).then((r) => {
      setMessages(r.messages);
    });
  }, [threadId]);

  useEffect(() => {
    if (shouldReloadThread) {
      getThread(threadId).then((r) => {
        setMessages(r.messages);
        setShouldReloadThread(false);
      });
    }
  }, [shouldReloadThread]);

  const scrollToBottom = (animated = true) => {
    scrollRef.current?.scrollToEnd();
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            dispatch(UserSlice.actions.setShouldReloadMessages(true));
            navigation.goBack();
          },
        }}
        middle={{
          type: "rawtext",
          title: subject,
        }}
      />

      {messages ? (
        <FlatList
          ref={scrollRef}
          data={messages}
          keyExtractor={(item) => `messages-list-${item.id}`}
          renderItem={(message) => {
            return <MessageItemComponent message={message.item} scrollToBottom={scrollToBottom} />;
          }}
          ListFooterComponent={<ResponseMessageFormComponent threadId={threadId} setReload={setShouldReloadThread} />}
        />
      ) : null}
    </View>
  );
}
