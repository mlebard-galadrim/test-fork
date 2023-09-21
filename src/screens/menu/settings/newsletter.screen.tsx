import React from "react";
import { StyleSheet, View } from "react-native";
import { NewsletterPreferencesBlock } from "../../../components/generic/notifications/newsletter-preferences-block.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import colors from "../../../themes/colors.theme";

export const NewsletterScreen = () => {
  return (
    <View>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
        }}
        middle={{
          type: "text",
          title: "leftMenu.submenus.settings.menus.newsletter.title",
        }}
      />
      <NewsletterPreferencesBlock />
    </View>
  );
};

const styles = StyleSheet.create({
  notificationBox: {
    marginHorizontal: 16,
    paddingRight: 8,
    marginBottom: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.transparent3,
    borderRadius: 4,
    alignItems: "center",
    paddingVertical: 16,
  },
});
