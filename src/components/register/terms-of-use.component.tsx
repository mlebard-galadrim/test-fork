import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from "react-native";
import HTMLView from "react-native-htmlview";
import { getContent } from "../../services/content.service";
import colors from "../../themes/colors.theme";
import { GoldBrokerText } from "../style/goldbroker-text.component";

const termsIcon = require("../../../assets/icons/register/icons-doc.png");

export const TermsOfServiceStep = () => {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    getContent("cms/content/appli/general-selling-conditions").then((res) => {
      setText(res.body);
    });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        width: "100%",
      }}
    >
      <Image source={termsIcon} style={{ width: 32, height: 32, marginBottom: 24 }} />
      <GoldBrokerText i18nKey="register.termsofservice.instruction" ssp mb={16} fontSize={17} />
      <ScrollView
        indicatorStyle="white"
        style={{
          backgroundColor: colors.transparent2,
          marginHorizontal: 16,
          marginBottom: 57,
          minWidth: "92%",
        }}
      >
        <View style={{ padding: 8, flex: 1, width: "100%" }}>
          {text ? (
            <HTMLView
              value={`<html>${text}</html>`}
              stylesheet={htmlStyles}
              textComponentProps={{ style: { color: colors.white } }}
              addLineBreaks={false}
            />
          ) : (
            <ActivityIndicator size="large" color="#FFF" />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

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
  em: {
    fontFamily: "SSPItalic",
  },
  strong: {
    fontFamily: "SSPBold",
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
});
