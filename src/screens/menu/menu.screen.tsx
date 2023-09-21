import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, View } from "react-native";
import styled from "styled-components";
import { Logo } from "../../components/generic/logo.component";
import { TopBar } from "../../components/generic/top-bar.component";
import { Item } from "../../components/home/menu/item.component";
import { LogSuggestion } from "../../components/home/menu/log-suggestion.component";
import { SocialNetwork } from "../../components/home/menu/social-network.component";
import { tabs } from "../../constants/home-menu/menu-items.constant";

const Container = styled(View)`
  display: flex;
  flex: 1;
`;

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <Container>
      <Logo />
      <TopBar
        right={{
          type: "buttonIcon",
          source: "x",
          function: () => {
            navigation.goBack();
          },
        }}
        mb={26}
      />
      <ScrollView>
        <LogSuggestion />
        {tabs.map((item, key) => {
          return <Item key={key} i18nKey={item.i18nKey} icon={item.icon} screen={item.screen} />;
        })}
      </ScrollView>
      <SocialNetwork />
    </Container>
  );
}
