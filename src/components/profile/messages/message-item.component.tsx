import { Entypo, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import HTMLView from "react-native-htmlview";
import { useSelector } from "react-redux";
import { UseDownload } from "../../../hooks/useDownload";
import { State, Store } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { convertTZ, convertTZMessage } from "../../../utils/date.utils";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

const downloadIcon = require("../../../../assets/icons/profile/icons-espace-client-download.png");
const replyIcon = require("../../../../assets/icons/profile/icons-r-pondre.png");
const goldbrokerLogo = require("../../../../assets/logo/logo-main.png");

export default function MessageItemComponent({ message, scrollToBottom }) {
  const state = Store.getState();
  const userId = state.userStore.userId;
  const isMyMessage = message.sender ? userId === message.sender.id : false;
  const { downloadFile } = UseDownload();
  const timezone = useSelector((state: State) => state.appStore.timezone);
  const locale = useSelector((state: State) => state.appStore.locale);
  return (
    <View style={styles(isMyMessage).container}>
      {message.sender ? (
        <View style={styles(isMyMessage).senderContainer}>
          {message.sender.picture ? (
            <Image source={{ uri: message.sender.picture }} style={styles(isMyMessage).senderPicture} />
          ) : (
            <Ionicons name="person" size={24} color="gray" style={styles(isMyMessage).senderDefaultPicture} />
          )}
          <GoldBrokerText value={`${message.sender.firstname} ${message.sender.lastname}`} fontSize={19} />
          {!isMyMessage ? (
            <TouchableOpacity
              style={{
                alignItems: "flex-end",
                flexGrow: 1,
              }}
              onPress={scrollToBottom}
            >
              <Image source={replyIcon} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : (
        <View style={styles(isMyMessage).senderContainer}>
          <Image source={goldbrokerLogo} style={styles(isMyMessage).senderPicture} />
          <GoldBrokerText value="TEAM OR.FR" />
          <TouchableOpacity
            style={{
              alignItems: "flex-end",
              flexGrow: 1,
            }}
            onPress={scrollToBottom}
          >
            <Image source={replyIcon} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        </View>
      )}
      <GoldBrokerText
        value={`${convertTZ(message.created_at, timezone, locale)} ${convertTZMessage(message.created_at, timezone, locale)}`}
        sspL
        ls={1.13}
        left
        fontSize={12}
        color={colors.transparent5}
        mb={7}
      />
      <HTMLView
        value={`<div>${message.body.replace("s*\\ns*", "\\n").split("    ").join("").split("\n\n\n").join("\n")}</div>`}
        stylesheet={htmlStyles}
        textComponentProps={{ style: { color: colors.white } }}
        addLineBreaks={false}
      />
      {message.attachments && message.attachments.length > 0 ? (
        <>
          <View
            style={{
              backgroundColor: colors.gray,
              height: 1,
              marginVertical: 15,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 17,
            }}
          >
            <Entypo name="attachment" size={18} style={{ marginRight: 12 }} color="white" />
            <GoldBrokerText i18nKey="profile.thread.attach" sspL fontSize={17} />
          </View>
          {message.attachments.map((attachment, key) => (
            <View key={key} style={styles(isMyMessage).attachmentContainer}>
              <GoldBrokerText value={attachment.name} fontSize={16} sspL />
              <GoldBrokerText value={` (${attachment.size} KB)`} fontSize={16} color={colors.transparent5} sspL />
              <TouchableOpacity onPress={() => downloadFile(attachment.name, attachment.url)}>
                <Image source={downloadIcon} style={{ width: 14, height: 17, marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          ))}
        </>
      ) : (
        <></>
      )}
    </View>
  );
}

const htmlStyles = StyleSheet.create({
  a: {
    color: colors.gold,
  },
  div: {
    color: colors.white,
    marginTop: 0,
    marginBottom: 0,
    fontFamily: "SSPRegular",
    fontSize: 17,
    textAlign: "justify",
  },
  p: {
    color: colors.white,
    marginTop: 0,
    marginBottom: 0,
    fontFamily: "SSPRegular",
    fontSize: 17,
    textAlign: "justify",
  },
  strong: {
    fontFamily: "SSPBold",
  },
  em: {
    fontFamily: "SSPItalic",
  },
});

const styles = (isMyMessage) =>
  StyleSheet.create({
    container: {
      backgroundColor: isMyMessage ? colors.gray3 : colors.lightDark,
      marginHorizontal: 16,
      marginBottom: 24,
      padding: 16,
    },
    senderContainer: {
      flexDirection: "row",
      marginBottom: 10,
    },
    senderPicture: {
      width: 40,
      height: 40,
      borderRadius: 4,
      marginRight: 16,
      resizeMode: "contain",
    },
    senderDefaultPicture: {
      marginRight: 16,
    },
    attachmentContainer: {
      marginBottom: 16,
      backgroundColor: colors.gray2,
      padding: 10,
      alignSelf: "flex-start",
      flexDirection: "row",
    },
  });
