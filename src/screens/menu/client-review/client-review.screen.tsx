import { ScrollView, View } from "react-native";

import React from "react";
import { State } from "../../../store/configure.store";
import { TopBar } from "../../../components/generic/top-bar.component";
import WebView from "react-native-webview";
import { deviceHeight } from "../../../constants/device.constant";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export const buildHtml = (locale) => {
  switch (locale) {
    case "fr":
      return `
      <html>
        <body>
          <div id="trustbox" class="trustpilot-widget" data-locale="fr-FR" data-template-id="539ad60defb9600b94d7df2c" data-businessunit-id="55262e970000ff00057ea43b" data-style-height="500px" data-style-width="100%" data-theme="light" data-stars="1,2,3,4,5" data-review-languages="fr">
            <a id="trustlink" href="https://fr.trustpilot.com/review/www.or.fr" hidden rel="noopener">Trustpilot</a>
          </div>
        </body>
      </html>`;
    case "de":
      return `
      <html>
        <body>
          <div id="trustbox" class="trustpilot-widget" data-locale="fr-FR" data-template-id="539ad60defb9600b94d7df2c" data-businessunit-id="55262e970000ff00057ea43b" data-style-height="500px" data-style-width="100%" data-theme="light" data-stars="1,2,3,4,5" data-review-languages="fr">
            <a id="trustlink" href="https://www.trustpilot.com/review/www.goldbroker.com" hidden rel="noopener">Trustpilot</a>
          </div>
        </body>
      </html>`;
    default:
      return `
      <html>
        <body>
          <div id="trustbox" class="trustpilot-widget" data-locale="en-EN" data-template-id="539ad60defb9600b94d7df2c" data-businessunit-id="55262e970000ff00057ea43b" data-style-height="500px" data-style-width="100%" data-theme="light" data-stars="1,2,3,4,5" data-review-languages="fr">
            <a id="trustlink" href="https://www.trustpilot.com/review/www.goldbroker.com" hidden rel="noopener">Trustpilot</a>
          </div>
        </body>
      </html>`;
  }
};
export const ClientReviewScreen = () => {
  const navigation = useNavigation();
  const locale = useSelector((state: State) => state.appStore.locale);
  const h = deviceHeight - 100;
  const html = buildHtml(locale);
  return (
    <ScrollView>
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
          title: "leftMenu.submenus.clientReview",
        }}
        mb={20}
      />
      <View>
        <WebView
          javaScriptEnabled={true}
          injectedJavaScript={`setTimeout(() => document.getElementById('trustlink').click(), 500)`}
          onMessage={(e) => {
            // For IOS to trigger javascript
          }}
          source={{
            html: html,
          }}
          style={{ height: h }}
        />
      </View>
    </ScrollView>
  );
};
