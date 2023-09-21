import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import HTMLView from "react-native-htmlview";
import { WebView } from "react-native-webview";
import { LightButton } from "../../../components/generic/buttons/light-button.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { GoldBrokerText } from "../../../components/style/goldbroker-text.component";
import { deviceWidth } from "../../../constants/device.constant";
import { useLogin } from "../../../hooks/useLogin";
import { getContent } from "../../../services/content.service";
import colors from "../../../themes/colors.theme";

export default function ServiceScreen({ route }) {
  const navigation = useNavigation();
  const { contentId, i18nKey } = route.params;
  const [htmlContent, setHtmlContent] = useState("");

  const { logged } = useLogin();

  const renderNode = (node, index, siblings, parent, defaultRenderer) => {
    if (node.name == "iframe") {
      const a = node.attribs;
      const iframeHtml = `<body style="padding: 0; margin: 0;"><iframe src="${a.src}" width=100% height=100% style="position: absolute;"></iframe></body>`;
      return (
        <View
          key={index}
          style={{
            width: deviceWidth - 32,
            height: Number(a.height) * ((deviceWidth - 32) / Number(a.width)),
          }}
        >
          <WebView source={{ html: iframeHtml }} style={{ backgroundColor: colors.dark }} />
        </View>
      );
    }

    if (node.name === "br") {
      return null;
    }

    if (node.name == "img") {
      const a = node.attribs;
      const imgHtml = `<body style="padding: 0; margin: 0;"><img src="${a.src}" width=100% height=100% style="position: absolute;"></img></body>`;

      return (
        <View
          key={index}
          style={{
            width: deviceWidth - 32,
            height: Number(a.height) * ((deviceWidth - 32) / Number(a.width)),
          }}
        >
          <WebView source={{ html: imgHtml }} />
        </View>
      );
    }

    if (node.name === "hr") {
      return (
        <View key={index}>
          <View
            style={{
              height: 1,
              width: deviceWidth,
              backgroundColor: colors.gray,
            }}
          />
          <View style={{ width: deviceWidth, height: 20 }} />
        </View>
      );
    }

    if (node.name === "div") {
      const attr = node.attribs;
      if (attr.class === "alert alert-info") {
        return (
          <View
            key={index}
            style={{
              borderWidth: 1,
              borderColor: colors.gray,
              padding: 10,
            }}
          >
            {defaultRenderer(node.children, parent)}
          </View>
        );
      } else {
        return <View key={index}>{defaultRenderer(node.children, parent)}</View>;
      }
    }
  };

  useEffect(() => {
    getContent(contentId).then((r) => {
      setHtmlContent(r.body.replace(/<p>&nbsp;<\/p>/g, "").replace('<p style="text-align: center;">&nbsp;</p>', ""));
    });
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
        }}
        middle={{
          type: "text",
          title: i18nKey,
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      <ScrollView
        style={{
          marginHorizontal: 12,
          marginBottom: 12,
        }}
      >
        {/* <WebView source={{ html: htmlContent }} style={{ height: 200 }} /> */}
        <HTMLView
          value={`<div>${htmlContent}</div>`}
          stylesheet={htmlStyle}
          addLineBreaks={false}
          renderNode={renderNode}
          bullet={"•  "}
        />
        {!logged ? (
          <View style={styles.createAccount}>
            <GoldBrokerText i18nKey="leftMenu.submenus.about.invest" fontSize={32} mb={32} mh={12} />
            <LightButton
              mh={34}
              large
              i18nKey="account.createAccount"
              onPress={() => navigation.navigate("RegisterNavigator")}
            />
          </View>
        ) : (
          <View style={{ height: 50 }} />
        )}
      </ScrollView>
    </View>
  );
}

const htmlStyle = StyleSheet.create({
  div: {
    color: colors.white,
  },
  a: {
    color: colors.gold,
  },
  em: {
    fontFamily: "SSPItalic",
  },
  strong: {
    fontFamily: "SSPBold",
  },
  p: {
    color: colors.white,
    margin: 0,
    padding: 0,
    fontFamily: "SSPRegular",
    fontSize: 17,
    textAlign: "justify",
  },
  h3: {
    color: colors.gold,
    fontSize: 24,
    fontFamily: "SSPBold",
  },
  h2: {
    color: colors.gold,
    fontSize: 24,
    fontFamily: "SSPBold",
  },
  h1: {
    color: colors.gold,
    fontSize: 24,
    fontFamily: "SSPBold",
  },
  h4: {
    color: colors.gold,
    fontSize: 18,
    fontFamily: "SSPBold",
  },
  ul: {
    color: colors.white,
    marginBottom: 0,
    fontSize: 16,
    marginTop: 0,
  },
});

const styles = StyleSheet.create({
  createAccount: {
    paddingTop: 46,
    paddingBottom: 46,
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: colors.lightDark,
  },
});
