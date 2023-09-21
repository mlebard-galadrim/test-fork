import { Item } from "../../../components/home/menu/item.component";
import React from "react";
import { TopBar } from "../../../components/generic/top-bar.component";
import { View } from "react-native";
import { settingstab } from "../../../constants/home-menu/menu-items.constant";
import { useNavigation } from "@react-navigation/native";

export const SettingsScreen = () => {
  const navigation = useNavigation();
  return (
    <View>
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
          title: "leftMenu.submenus.settings.title",
        }}
      />
      <View>
        {settingstab.map((item, key) => {
          return (
            <Item
              key={key}
              i18nKey={item.i18nKey}
              icon={item.icon}
              screen={item.screen}
            />
          );
        })}
      </View>
    </View>
  );
};
