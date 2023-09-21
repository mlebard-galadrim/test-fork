import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import HTMLView from "react-native-htmlview";
import Icon from "react-native-vector-icons/Octicons";
import { useSelector } from "react-redux";
import { environment } from "../../../environments";
import { getBeandeauNews } from "../../../services/configs.service";
import { getPost, getPostIdByUrl } from "../../../services/posts.service";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

const infoIcon = require("../../../../assets/icons/profile/myprofile/icons-espace-client-to-do.png");
const newsIcon = require("../../../../assets/icons/profile/myprofile/icons-espace-client-alerte.png");

export default function BandeauComponent() {
  const navigation = useNavigation();
  const address_status = useSelector((state: State) => state.userStore.address_status);
  const bank_account_status = useSelector((state: State) => state.userStore.bank_account_status);
  const identity_status = useSelector((state: State) => state.userStore.identity_status);

  const [alertMessageEnabled, setAlertMessageEnabled] = useState<boolean>(false);
  const [messageContent, setMessageContent] = useState<string>("");

  useEffect(() => {
    getBeandeauNews().then((res) => {
      if (res.alert_message.enabled) {
        setAlertMessageEnabled(res.alert_message.enabled);
        setMessageContent(res.alert_message.content);
      }
    });
  }, []);

  const bandeauClick = async (href: string) => {
    const baseUrl = environment.baseUrl;
    const responseHeaders = await getPostIdByUrl(baseUrl + href);
    const postId = responseHeaders["object-id"];
    getPost(postId).then((res) => {
      const publication = res;
      navigation.navigate("TextPublicationScreen", { publication });
    });
  };

  return (
    <View style={styles.container}>
      {address_status !== 1 || bank_account_status !== 1 || identity_status !== 1 ? (
        <TouchableOpacity style={styles.infoBandeau} onPress={() => navigation.navigate("MyProfileScreen")}>
          <Image source={infoIcon} style={{ width: 20, height: 20 }} />
          <GoldBrokerText i18nKey="profile.dashboard.banner.profile" color={colors.text.blue} fontSize={16} sspL flex left mh={16} />
          <Icon name="chevron-right" size={20} style={{ color: colors.text.blue }} />
        </TouchableOpacity>
      ) : null}
      {alertMessageEnabled && messageContent ? (
        <View style={styles.newsBandeau}>
          <Image source={newsIcon} style={{ width: 20, height: 20 }} />
          <View style={{ flex: 1, marginHorizontal: 16 }}>
            <HTMLView
              value={`<div>${messageContent?.trim()}</div>`}
              stylesheet={htmlStyles}
              textComponentProps={{ style: { color: colors.white } }}
              addLineBreaks={false}
              onLinkPress={bandeauClick}
            />
          </View>
          {/* <GoldBrokerText value={messageContent} color={colors.text.purple} fontSize={16} sspL flex left mh={16} /> */}
          <Icon name="chevron-right" size={20} style={{ color: colors.text.purple }} />
        </View>
      ) : null}
    </View>
  );
}

const htmlStyles = StyleSheet.create({
  a: {
    color: colors.text.purple,
  },
  div: {
    marginBottom: 0,
  },
  p: {
    color: colors.text.purple,
    fontFamily: "SSPRegular",
    fontSize: 16,
    textAlign: "justify",
  },
  strong: {
    fontFamily: "SSPBold",
  },
  em: {
    fontFamily: "SSPItalic",
  },
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 26,
  },
  infoBandeau: {
    backgroundColor: "rgba(118, 189, 255, 0.16)",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  newsBandeau: {
    backgroundColor: "rgba(200, 144, 244, 0.08)",
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
});
