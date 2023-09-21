import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { useNavigation } from "@react-navigation/native";
import HTMLView from "react-native-htmlview";
import { TopBar } from "../../../components/generic/top-bar.component";
import { getContent } from "../../../services/content.service";
import colors from "../../../themes/colors.theme";

export const CguScreen = () => {
  const navigation = useNavigation();
  const [content, setContent] = useState<string>();

  useEffect(() => {
    getContent("cms/content/appli/terms-use-privacy").then((r) => setContent(r.body));
  }, []);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
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
          title: "leftMenu.submenus.termsOfService.title",
        }}
      />
      <View style={styles.textView}>
        {content ? (
          <HTMLView
            value={`<html>${content}</html>`}
            stylesheet={htmlStyles}
            textComponentProps={{ style: { color: colors.white } }}
            addLineBreaks={false}
          />
        ) : (
          <ActivityIndicator size="large" color="#FFF" />
        )}
      </View>
    </ScrollView>
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
    marginBottom: 8,
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

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    height: 52,
    flexDirection: "row", // row
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "space-between", // center, space-around
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 24,
    minWidth: "100%",
  },
  textView: {
    backgroundColor: colors.transparent2,
    marginLeft: 16,
    marginRight: 16,
    padding: 16,
  },
});
