import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import styled from "styled-components";
import { TitleTextBlock } from "../../../../../components/generic/title-text.component";
import { Title } from "../../../../../components/generic/title.component";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import { environment } from "../../../../../environments";
import { UseDownload } from "../../../../../hooks/useDownload";
import colors from "../../../../../themes/colors.theme";
import { Bulletin } from "./bulletin.component";
import { UseBulletins } from "./useBulletins";

export const ViewContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  font-size: 20px;
  padding-bottom: 10px;
  margin-top: 10px;
  border-bottom-width: ${(props) => (props.noborder ? 0 : 1)}px;
  border-bottom-color: ${colors.lightDark};
  background-color: ${colors.gray2};
`;

export const RightSideView = styled(View)`
  flex: 1;
  justify-content: space-evenly;
`;

const Container = styled(View)`
  height: 100%;
  display: flex;
`;

export const BulletinsScreen = () => {
  const navigation = useNavigation();
  const { bulletins, fetchMoreData, isRefreshing, fetchBulletins } = UseBulletins();
  const { downloadFile } = UseDownload();
  const renderItem = ({ item }) => {
    return (
      <View style={{ flex: 1 }}>
        <Bulletin
          title={item.title}
          illustration={item.illustration}
          description={item.description}
          id={item.id}
          handleDownload={() => {
            downloadFile(`bulletin-${item.title}.pdf`, `${environment.apiUrl}/bulletins/${item.id}/download`);
          }}
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
            navigation.navigate("SideMenuScreen");
          },
        }}
        mb={17}
      />
      <Title title="profile.menu.bulletins" />
      <View style={styles.bulletinsList}>
        <FlatList
          data={bulletins}
          onRefresh={fetchBulletins}
          refreshing={isRefreshing}
          keyExtractor={(item, index) => `${item.id}-${index}`}
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
};

const styles = StyleSheet.create({
  bulletinsList: {
    marginHorizontal: 16,
    marginTop: 16,
    flex: 1,
  },
});
