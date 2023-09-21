import { AntDesign } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import i18n from "i18n-js";
import React from "react";
import { Alert, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, Tooltip } from "react-native-elements";
import { GoldBrokerText } from "../../../../../components/style/goldbroker-text.component";
import { deviceWidth } from "../../../../../constants/device.constant";
import colors from "../../../../../themes/colors.theme";

type Props = {
  documentList: any[];
  setDocumentList: React.Dispatch<React.SetStateAction<any[]>>;
  maxDocument?: number;
  tooltip: any;
};

const deleteDocumentIcon = require("../../../../../../assets/icons/profile/icons-delete.png");
const addDocumentIcon = require("../../../../../../assets/icons/profile/icons-espace-client-add-document.png");

export const AttachmentComponent = ({ documentList, setDocumentList, maxDocument = 15, tooltip }: Props) => {
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync();

    if (result.type === "success") {
      const formattedResult = {
        ...result,
        type: result.mimeType,
      };
      setDocumentList([...documentList, { ...formattedResult, size: `(${result.size}KB)` }]);
    } else {
      Alert.alert(i18n.t("profile.new_message.attach_fail"));
    }
  };

  const truncate = (str: string, n: number) => {
    return str.length > n ? str.substring(0, n - 1) + "..." : str;
  };

  const pickCamera = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();
    if (result.cancelled === false) {
      const docFormat = { name: truncate(result.uri.split("/").pop(), 15), size: `(${result.width}x${result.height}px)`, uri: result.uri };
      setDocumentList([...documentList, docFormat]);
    }
  };

  const startSelection = () => {
    Alert.alert(i18n.t("profile.myProfile.newAttachment.title"), i18n.t("profile.myProfile.newAttachment.content"), [
      {
        text: i18n.t("profile.myProfile.newAttachment.buttonDocument"),
        onPress: pickDocument,
      },
      {
        text: i18n.t("profile.myProfile.newAttachment.buttonImage"),
        onPress: pickCamera,
      },
    ]);
  };

  return (
    <>
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <GoldBrokerText i18nKey={"profile.myProfile.documents"} color={colors.gray} sspL fontSize={16} mb={8} />
        {documentList.map((document, index) => {
          return (
            <View key={index} style={styles.attachmentDocument}>
              <Text>
                <GoldBrokerText left value={document.name} ssp fontSize={14} />
                <GoldBrokerText left value={``} color={colors.transparent5} ssp fontSize={14} />
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
      {documentList.length < maxDocument ? (
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <TouchableOpacity style={styles.addAttachment} onPress={startSelection}>
            <Image source={addDocumentIcon} style={{ width: 24, height: 24, marginRight: 12 }} />
            <GoldBrokerText i18nKey="profile.new_message.add_attach" fontSize={16} sspL color={colors.gold} />
          </TouchableOpacity>
          <Tooltip
            popover={
              <View>
                {tooltip.map((t, index) => (
                  <Text key={index} style={{ color: colors.white }}>
                    {t.trim()}
                  </Text>
                ))}
              </View>
            }
            width={deviceWidth - 20}
            height={null}
            backgroundColor={colors.darkBlue}
            containerStyle={undefined}
            overlayColor={undefined}
            ModalComponent={undefined}
            toggleOnPress={undefined}
            toggleAction={undefined}
            onOpen={undefined}
            withPointer={false}
            onClose={undefined}
            withOverlay={undefined}
            highlightColor={undefined}
            skipAndroidStatusBar={undefined}
            closeOnlyOnBackdropPress={undefined}
          >
            <AntDesign name="unknowfile1" size={24} color={colors.gold} />
          </Tooltip>
        </View>
      ) : null}
    </>
  );
};

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
