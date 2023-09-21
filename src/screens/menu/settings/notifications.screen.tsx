import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { NotificationsBlock } from "../../../components/generic/notifications/notifications-block.components";
import { TopBar } from "../../../components/generic/top-bar.component";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";

export const NotificationsScreen = () => {
  const notificationId = useSelector((state: State) => state.appStore.notificationId);
  return (
    <View>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
        }}
        middle={{
          type: "text",
          title: "leftMenu.submenus.settings.menus.notifications.title",
        }}
      />
      <NotificationsBlock />
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
