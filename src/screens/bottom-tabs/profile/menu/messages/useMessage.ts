import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../../../store/configure.store";
import AppSlice from "../../../../../store/slices/app.slice";
import UserSlice from "../../../../../store/slices/user.slice";
import { getInboxMessage, getSentMessage } from "./../../../../../services/messages.service";

export const UseMessage = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState<string>("inbox");
  const [inboxMessage, setInboxMessage] = useState([]);
  const [sentMessage, setSentMessage] = useState([]);
  const shouldReloadMessages = useSelector((state: State) => state.userStore.shouldReloadMessages);

  navigation.addListener("focus", () => {
    dispatch(AppSlice.actions.setShouldNavigateMessages(false));
  });

  const loadMessages = () => {
    getInboxMessage().then((r) => {
      setInboxMessage(r._embedded.items);
    });
    getSentMessage().then((r) => {
      setSentMessage(r._embedded.items);
    });
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (shouldReloadMessages) {
      loadMessages();
      dispatch(UserSlice.actions.setShouldReloadMessages(false));
    }
  }, [shouldReloadMessages]);

  return {
    navigation,
    selected,
    setSelected,
    loadMessages,
    inboxMessage,
    sentMessage,
  };
};
