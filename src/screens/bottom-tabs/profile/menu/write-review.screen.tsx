import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import WebView from "react-native-webview";
import { useSelector } from "react-redux";
import { TopBar } from "../../../../components/generic/top-bar.component";
import { State } from "../../../../store/configure.store";

export default function WriteReviewScreen() {
  const navigation = useNavigation();
  const locale = useSelector((state: State) => state.appStore.locale);
  const uri = locale === "fr" ? "https://fr.trustpilot.com/evaluate/or.fr" : "https://www.trustpilot.com/evaluate/www.goldbroker.com";
  return (
    <View style={{ flex: 1 }}>
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
          title: "review.title",
        }}
      />
      <View style={{ flex: 1 }}>
        <WebView
          source={{
            uri,
          }}
          style={{ backgroundColor: "transparent" }}
        />
      </View>
    </View>
  );
}
