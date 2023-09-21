import { Entypo } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import i18n from "i18n-js";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createThreadMesage } from "../../../services/messages.service";
import colors from "../../../themes/colors.theme";
import { LightButton } from "../../generic/buttons/light-button.component";
import { GoldbrokerInput } from "../../style/goldbroker-input.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

const addDocumentIcon = require("../../../../assets/icons/profile/icons-espace-client-add-document.png");
const deleteDocumentIcon = require("../../../../assets/icons/profile/icons-delete.png");

export default function ResponseMessageFormComponent({ threadId, setReload }) {
  const [body, setBody] = useState("");
  const [documentList, setDocumentList] = useState([]);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync();
    if (result.type === "success") {
      const formattedResult = {
        ...result,
        type: result.mimeType,
      };
      setDocumentList([...documentList, formattedResult]);
    } else {
      Alert.alert(i18n.t("profile.new_message.attach_fail"));
    }
  };

  const sendMessage = async () => {
    const data = new FormData();
    data.append("body", body);
    if (documentList.length > 0) {
      documentList.map((doc) => {
        const formattedDoc = {
          ...doc,
          type: doc.mimeType,
        };

        data.append("attachments[][file]", formattedDoc, doc.name);
        // data.append("attachments[][file]", doc, doc.name);
      });
    }
    try {
      await createThreadMesage(data, threadId);
      setBody("");
      setDocumentList([]);
      setReload(true);
    } catch (error) {}
  };

  return (
    <>
      <View style={{ height: 1, backgroundColor: colors.gray, marginVertical: 32 }} />
      <View style={{ marginHorizontal: 16 }}>
        <GoldbrokerInput padding={0} placeholder={i18n.t("profile.new_message.body")} multiline={true} height={165} value={body} onChange={setBody} />
        <View style={styles.attachmentTitle}>
          {documentList.length > 0 ? (
            <>
              <Entypo name="attachment" size={18} style={{ marginRight: 8 }} color="white" />
              <GoldBrokerText i18nKey="profile.new_message.attach" fontSize={16} ssp />
            </>
          ) : null}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {documentList.map((document, index) => {
            return (
              <View key={index} style={styles.attachmentDocument}>
                <Text style={{ flex: 1 }}>
                  <GoldBrokerText left value={document.name} ssp fontSize={14} />
                  <GoldBrokerText left value={` (${document.size} KB)`} color={colors.transparent5} ssp fontSize={14} />
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    const tempArray = [...documentList];
                    tempArray.splice(index, 1);
                    setDocumentList(tempArray);
                  }}
                >
                  <Image source={deleteDocumentIcon} style={{ width: 13, height: 16, marginHorizontal: 8 }} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <View
          style={{
            flexDirection: "row",
            marginBottom: 42,
            marginTop: 12,
          }}
        >
          <TouchableOpacity style={styles.addAttachment} onPress={pickDocument}>
            <Image source={addDocumentIcon} style={{ width: 24, height: 24, marginRight: 12 }} />
            <GoldBrokerText i18nKey="profile.new_message.add_attach" fontSize={16} sspL color={colors.gold} />
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: 60, marginBottom: 65 }}>
          <LightButton large ph={30} i18nKey="profile.new_message.send" onPress={() => sendMessage()} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  attachmentTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  attachmentDocument: {
    flexDirection: "row",
    alignSelf: "flex-start",
    backgroundColor: colors.gray2,
    padding: 10,
    marginRight: 2,
    marginBottom: 8,
    flexGrow: 1,
    justifyContent: "space-between",
  },
  addAttachment: {
    backgroundColor: "rgba(245, 215, 158, 0.1)",
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
});
