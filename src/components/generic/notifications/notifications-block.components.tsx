import React, { useEffect } from "react";
import { StyleSheet, Switch, View } from "react-native";
import { useSelector } from "react-redux";
import { editDevice } from "../../../services/devices.service";
import { State, Store } from "../../../store/configure.store";
import PreferencesSlice from "../../../store/slices/preferences.slice";
import colors from "../../../themes/colors.theme";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

export const NotificationsBlock = ({ register = null }) => {
  const { newMessage, newPublication } = useSelector((state: State) => state.preferencesStore.notifications);
  const notificationId = useSelector((state: State) => state.appStore.notificationId);
  const locale = useSelector((state: State) => state.appStore.locale);

  useEffect(() => {
    if (register) {
      Store.dispatch(
        PreferencesSlice.actions.setNotifications({
          newMessage: true,
          newPublication: true,
        })
      );
    }
  }, []);

  useEffect(() => {
    void editDevice(notificationId, newPublication ? 1 : 0, newMessage ? 1 : 0, locale);
  }, [newMessage, newPublication]);

  return (
    <View style={{ marginHorizontal: 12 }}>
      {!notificationId ? <GoldBrokerText left fontSize={16} mb={16} sspM i18nKey="register.notifications.allowMessage" /> : null}
      <View style={styles.notificationBox}>
        <GoldBrokerText flex left fontSize={16} mh={8} sspM i18nKey="register.notifications.setting1" />
        <Switch
          value={newMessage}
          trackColor={{ false: colors.inactiveText, true: colors.gold }}
          thumbColor={colors.white}
          onValueChange={() => {
            Store.dispatch(
              PreferencesSlice.actions.setNotifications({
                newMessage: !newMessage,
                newPublication: newPublication,
              })
            );
          }}
          disabled={!notificationId}
        />
      </View>
      <View style={styles.notificationBox}>
        <GoldBrokerText flex left fontSize={16} mh={8} sspM i18nKey="register.notifications.setting2" />
        <Switch
          value={newPublication}
          trackColor={{ false: colors.inactiveText, true: colors.gold }}
          thumbColor={colors.white}
          onValueChange={() => {
            Store.dispatch(
              PreferencesSlice.actions.setNotifications({
                newMessage: newMessage,
                newPublication: !newPublication,
              })
            );
          }}
          disabled={!notificationId}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  notificationBox: {
    paddingRight: 8,
    marginBottom: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.transparent3,
    borderRadius: 4,
    alignItems: "center",
    paddingVertical: 16,
    width: "100%",
  },
});
