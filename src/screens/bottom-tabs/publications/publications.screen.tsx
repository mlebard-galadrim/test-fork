import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Searchbar } from "../../../components/generic/searchbar/searchbar.component";
import { TitleTextBlock } from "../../../components/generic/title-text.component";
import { Title } from "../../../components/generic/title.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { Publication } from "../../../components/home/publication.component";
import { State } from "../../../store/configure.store";
import { UsePublications } from "./usePublications";

const Container = styled(View)`
  height: 100%;
  display: flex;
`;

export default function PublicationsScreen() {
  const navigation = useNavigation();
  const {
    author,
    publicationType,
    subject,
    search,
    setSearch,
    searchFilterPublications,
    filterPublication,
    reloadPublications,
    fetchMoreData,
    isActive,
    isRefreshing,
    fetchPublications,
  } = UsePublications();
  const shouldReload = useSelector((state: State) => state.publicationFilterStore.shouldReload);

  useEffect(() => {
    searchFilterPublications();
  }, [search]);

  useEffect(() => {
    reloadPublications();
  }, [shouldReload]);

  const renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1 }}>
        <Publication
          title={item.title}
          author={item._embedded ? `${item._embedded.author.firstname} ${item._embedded.author.lastname}` : item.author}
          publication={item}
          illustration={item.illustration}
        />
      </View>
    );
  };

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
        mb={17}
      />
      <Title title="news.title" />
      <Searchbar active={isActive(publicationType, subject, author)} setSearch={setSearch} search={search} filterScreen="PublicationFilterScreen" />
      <View style={styles.publicationsList}>
        <FlatList
          data={filterPublication}
          onRefresh={fetchPublications}
          refreshing={isRefreshing}
          keyExtractor={(item, index) => `${item.id}-${item.type}-${item.published_at}-${index}`}
          renderItem={renderItem}
          ListEmptyComponent={
            <View style={{ marginTop: "20%" }}>
              <TitleTextBlock i18nKeyTitle="news.emptySearch.title" i18nKeyBody="news.emptySearch.body" />
            </View>
          }
          onEndReached={fetchMoreData}
          onEndReachedThreshold={0.2}
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  publicationsList: {
    marginHorizontal: 16,
    marginTop: 16,
    flex: 1,
  },
});
