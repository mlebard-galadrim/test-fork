import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import i18n from "i18n-js";
import React, { useState } from "react";
import { Alert, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { createMessage } from "../../../services/messages.service";
import colors from "../../../themes/colors.theme";
import { LightButton } from "../../generic/buttons/light-button.component";
import { GoldbrokerInput } from "../../style/goldbroker-input.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

const deleteDocumentIcon = require("../../../../assets/icons/profile/icons-delete.png");
const addDocumentIcon = require("../../../../assets/icons/profile/icons-espace-client-add-document.png");

export default function NewMessageComponent({ automaticMessage }) {
  const [documentList, setDocumentList] = useState([]);
  const [object, setObject] = useState(automaticMessage?.subject || "");
  const [body, setBody] = useState(automaticMessage?.body || "");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

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
    setLoading(true);
    const data = new FormData();
    data.append("subject", object);
    data.append("body", body);
    if (documentList.length > 0) {
      documentList.map((doc) => {
        data.append("attachments[][file]", doc, doc.name);
      });
    }
    await createMessage(data);
    setLoading(false);
    navigation.navigate("SuccessMessageScreen");
  };

  return (
    <TouchableWithoutFeedback style={{ height: "100%", paddingTop: 42 }} onPress={() => Keyboard.dismiss()}>
      <ScrollView style={{ flex: 1, marginHorizontal: 12 }} contentContainerStyle={{ flex: 1 }}>
        <GoldbrokerInput padding={0} placeholder={i18n.t("profile.new_message.object")} mb={12} value={object} onChange={setObject} />
        <GoldbrokerInput padding={0} placeholder={i18n.t("profile.new_message.body")} multiline={true} height={165} value={body} onChange={setBody} />
        <View style={styles.attachmentContainer}>
          {documentList.length > 0 && (
            <>
              <Entypo name="attachment" size={18} style={{ marginRight: 8 }} color="white" />
              <GoldBrokerText i18nKey="profile.new_message.attach" fontSize={16} ssp />
            </>
          )}
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {documentList.map((document, index) => {
            return (
              <View key={index} style={styles.attachmentDocument}>
                <Text>
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
          }}
        >
          <TouchableOpacity style={styles.addAttachment} onPress={pickDocument}>
            <Image source={addDocumentIcon} style={{ width: 24, height: 24, marginRight: 12 }} />
            <GoldBrokerText i18nKey="profile.new_message.add_attach" fontSize={16} sspL color={colors.gold} />
          </TouchableOpacity>
        </View>
        <View style={{ marginHorizontal: 60 }}>
          <LightButton inactive={loading} large ph={60} i18nKey="profile.new_message.send" onPress={() => sendMessage()} />
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  attachmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
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
