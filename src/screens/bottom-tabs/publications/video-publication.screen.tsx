import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";
import { TopBar } from "../../../components/generic/top-bar.component";
import { SectionNews } from "../../../components/home/section/section-news.component";
import { GoldBrokerText } from "../../../components/style/goldbroker-text.component";
import { publicationShare } from "../../../utils/share.utils";

export const VideoPublicationScreen = ({ navigation, route }) => {
  const publication = route.params.publication;
  const shareIcon = require(`../../../../assets/icons/more/icons-menu-partager.png`);

  return (
    <ScrollView>
      <Image source={{ uri: publication.thumbnail_url }} style={styles.bgImage} />
      <LinearGradient colors={["rgba(35,35,35,0.5)", "rgba(35,35,35,1)"]} style={styles.bgImage} />
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            navigation.goBack();
          },
        }}
        right={{
          type: "buttonImage",
          source: shareIcon,
          function: () => {
            publicationShare(publication.url, publication.title);
          },
        }}
        mb={0}
      />
      <View style={{ marginHorizontal: 16 }}>
        <GoldBrokerText mt={36} mb={30} fontSize={35} value={publication.title} />
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: publication.url }}
            style={{ height: 300, marginBottom: 20 }}
            allowsFullscreenVideo={true}
          />
        </View>
      </View>
      <SectionNews nb={5} publicationType="videos" i18nKey="news.similarVideos" currentPublication={publication} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: 200,
  },
});
