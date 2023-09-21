import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Logo } from "../../../components/generic/logo.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { LogSuggestion } from "../../../components/home/menu/log-suggestion.component";
import { SectionCours } from "../../../components/home/section/section-cours.component";
import { SectionNews } from "../../../components/home/section/section-news.component";
import { SectionProduct } from "../../../components/home/section/section-products.component";
import { useLogin } from "../../../hooks/useLogin";
import { State } from "../../../store/configure.store";
import { loadMetals, loadProducts, loadPublications } from "../../../utils/data.utils";

const Container = styled(View)`
  height: 100%;
  display: flex;
`;

export default function HomeScreen() {
  const navigation = useNavigation();
  const locale = useSelector((state: State) => state.appStore.locale);
  const { logged } = useLogin();
  const currency = useSelector((state: State) => state.preferencesStore.currency);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await loadMetals();
    await loadPublications([], [], 1, 10);
    await loadProducts(currency);
    setRefreshing(false);
  };

  useEffect(() => {
    refresh();
  }, [locale]);

  return (
    <Container>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "three-bars",
          function: () => {
            navigation.navigate("MenuNavigator");
          },
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: async () => {
            navigation.navigate("ContactNavigator");
          },
        }}
        mb={26}
      />
      <Logo />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={"white"} />}>
        {!logged ? (
          <View style={{ flex: 1, marginBottom: 26 }}>
            <LogSuggestion />
          </View>
        ) : null}
        <SectionCours />
        <SectionNews button i18nKey="home.news" nb={3} />
        <SectionProduct i18nKey="home.products" button goToTop={() => {}} />
      </ScrollView>
    </Container>
  );
}
