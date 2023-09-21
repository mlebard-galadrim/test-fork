import { isDevice } from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Store } from "../store/configure.store";
import AppSlice from "../store/slices/app.slice";
import PreferencesSlice from "../store/slices/preferences.slice";
import { createDevice, getDevice } from "./../services/devices.service";

type RegisterNotificationProps = {
  currentNotificationId: string;
  locale: string;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const registerForPushNotifcationsAsync = async ({ currentNotificationId, locale }: RegisterNotificationProps) => {
  let token;

  if (isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Store.dispatch(AppSlice.actions.setNotificationId(""));
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (token) {
    try {
      const device = await getDevice(token);
      Store.dispatch(AppSlice.actions.setNotificationId(token));
      Store.dispatch(
        PreferencesSlice.actions.setNotifications({
          newMessage: device.message_notifications,
          newPublication: device.news_notifications,
        })
      );
    } catch (error) {
      try {
        const device = await createDevice(token, 0, 0, locale);
        Store.dispatch(AppSlice.actions.setNotificationId(token));
        Store.dispatch(
          PreferencesSlice.actions.setNotifications({
            newMessage: device.message_notifications,
            newPublication: device.news_notifications,
          })
        );
      } catch (error) {}
    }
  }
};
