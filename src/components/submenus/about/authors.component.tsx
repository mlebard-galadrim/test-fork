import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { deviceWidth } from "../../../constants/device.constant";
import { getUserCollection } from "../../../services/users.service";
import PublicationFilterSlice from "../../../store/slices/publication-filter.slice";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { TopBorder } from "./topborder.component";

const dummyPicture = require("../../../../assets/portrait/group.png");

export const AuthorsBlock = () => {
  const pictureWidth = (deviceWidth - 20 - 18) / 3; // 20 : padding left and right // 18 : margin between pictures
  const [authors, setAuthors] = useState([]);
  useEffect(() => {
    getUserCollection().then((r) => {
      setAuthors([...r._embedded.items]);
    });
  }, []);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleAuthorClick = (item) => {
    dispatch(PublicationFilterSlice.actions.setAuthor([item.id]));
    dispatch(PublicationFilterSlice.actions.setShouldReload(true));
    navigation.navigate("Publications");
  };

  return (
    <View style={styles.container}>
      <TopBorder />
      <GoldBrokerText i18nKey="leftMenu.submenus.about.authors" fontSize={32} mt={32} mb={24} />
      <View style={styles.listPicture}>
        {authors.map((item, key) => {
          return (
            <TouchableOpacity
              key={key}
              onPress={() => handleAuthorClick(item)}
              style={{
                marginBottom: 20,
                width: pictureWidth,
              }}
            >
              <Image source={{ uri: item.picture }} style={{ width: pictureWidth, height: pictureWidth }} />
              <GoldBrokerText fontSize={16} value={`${item.firstname} ${item.lastname}`} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 10,
    paddingLeft: 10,
    marginBottom: 25,
    alignItems: "center",
    paddingBottom: 30,
  },
  listPicture: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
