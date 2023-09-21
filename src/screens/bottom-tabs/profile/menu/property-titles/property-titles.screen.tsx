import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { TopBar } from "../../../../../components/generic/top-bar.component";

export const PropertyTitlesScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "three-bars",
          function: () => {
            navigation.navigate("SideMenuScreen");
          },
        }}
        middle={{
          type: "text",
          title: "profile.menu.property_titles",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
    </View>
  );
};
