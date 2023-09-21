import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import i18n from "i18n-js";
import React, { useEffect } from "react";
import { Image } from "react-native";
import { useDispatch } from "react-redux";
import { tabs } from "../../constants/tabs.constant";
import { getPost } from "../../services/posts.service";
import AppSlice from "../../store/slices/app.slice";
import colors from "../../themes/colors.theme";
import { getIconSource } from "../../utils/bottom-bar.utils";

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  let initialRouteName = "HomeScreen";
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    Notifications.addNotificationResponseReceivedListener((notification) => {
      const { type, id } = notification.notification.request.content.data;
      if (type === "post") {
        getPost(id).then((res) => {
          const publication = res;
          navigation.navigate("TextPublicationScreen", { publication });
        });
      } else if (type === "message") {
        dispatch(AppSlice.actions.setShouldNavigateMessages(true));
        navigation.navigate("Profile", { screen: "MessagesScreen" });
      }
    });
  }, []);

  return (
    <BottomTab.Navigator
      initialRouteName={initialRouteName}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        style: {
          height: 50,
          paddingVertical: 4,
          backgroundColor: colors.black,
          borderTopWidth: 0,
        },
        labelPosition: "below-icon",
        labelStyle: { marginBottom: 7 },
        iconStyle: { marginTop: 0 },
        activeTintColor: colors.gold,
      }}
      screenOptions={({ route }) => ({
        tabBarVisible: true,
        tabBarIcon: ({ focused }) => {
          let iconSource = getIconSource(route.name, focused);
          return <Image style={{ width: 24, height: 24, resizeMode: "contain" }} source={iconSource} />;
        },
      })}
    >
      {tabs.map((tab) => {
        return (
          <BottomTab.Screen
            key={tab.key}
            initialParams={tab.initialParams}
            name={tab.key}
            component={tab.component}
            options={{
              tabBarLabel: i18n.t(tab.i18nKey),
            }}
            listeners={tab.listener || undefined}
          />
        );
      })}
    </BottomTab.Navigator>
  );
}
