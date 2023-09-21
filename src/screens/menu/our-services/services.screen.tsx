import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView } from "react-native";
import { TopBar } from "../../../components/generic/top-bar.component";
import { ServiceItem } from "../../../components/submenus/our-services/item.component";
import { tabs } from "../../../constants/home-menu/services.constant";

export const ServicesScreen = () => {
  const navigation = useNavigation();
  return (
    <>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
        }}
        middle={{
          type: "text",
          title: "leftMenu.submenus.services.title",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {tabs.map((item, index) => {
          return <ServiceItem i18nKey={item.i18nKey} key={index} contentId={item.key} picture={item.picture} />;
        })}
      </ScrollView>
    </>
  );
};
