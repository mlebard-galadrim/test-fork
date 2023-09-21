import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import { Image, LayoutChangeEvent, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { twitterXIcon } from "../../../constants/icon.constant";
import PublicationFilterSlice from "../../../store/slices/publication-filter.slice";
import colors from "../../../themes/colors.theme";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { TopBorder } from "./topborder.component";
const publication = require("../../../../assets/icons/bottomBar/icons-bottom-actualit-active.png");
const book = require("../../../../assets/icons/more/icons-social-book.png");
const website = require("../../../../assets/icons/more/icons-social-web-site.png");

const seeMore = require("../../../../assets/icons/more/more-icon.png");
const seeLess = require("../../../../assets/icons/more/less-icon.png");

type CardFounderProps = {
  author: any;
  scrollRef: React.MutableRefObject<ScrollView>;
};

export const CardFounder = ({ author, scrollRef }: CardFounderProps) => {
  const [expand, setExpand] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [founderX, setFounderX] = useState<number>(0);
  const [founderY, setFounderY] = useState<number>(0);

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    setFounderX(nativeEvent.layout.x);
    setFounderY(nativeEvent.layout.y);
  };

  const handleAuthorClick = (id) => {
    dispatch(PublicationFilterSlice.actions.setAuthor([id]));
    dispatch(PublicationFilterSlice.actions.setShouldReload(true));
    navigation.navigate("Publications");
  };

  const handleExpandClick = () => {
    if (expand) {
      scrollRef.current.scrollTo({ x: founderX, y: founderY, animated: true });
    }
    setExpand(!expand);
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <TopBorder />
      <Image source={author.picture} style={styles.portrait} />
      <GoldBrokerText value={author.name} fontSize={19} mb={4} />
      <GoldBrokerText ssp ls uppercase value={author.job} fontSize={12} color={colors.gray} />
      <View style={styles.listIcon}>
        {author.twitter && (
          <TouchableOpacity style={styles.icon} onPress={() => Linking.openURL(author.twitter)}>
            <Image style={styles.iconStyle} source={twitterXIcon} />
          </TouchableOpacity>
        )}
        {author.facebook && (
          <TouchableOpacity style={styles.icon} onPress={() => Linking.openURL(author.facebook)}>
            <Entypo name="facebook" size={24} color={colors.gold} />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.icon} onPress={() => handleAuthorClick(author.id)}>
          <Image source={publication} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        {author.website && (
          <TouchableOpacity style={styles.icon} onPress={() => Linking.openURL(author.website)}>
            <Image source={website} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        )}
        {author.book && <Image source={book} style={{ width: 24, height: 24 }} />}
      </View>
      <GoldBrokerText ssp left mh={34} mb={24} fontSize={17} value={author.description} nblines={expand ? undefined : 10} />
      <TouchableOpacity onPress={handleExpandClick}>
        <Image source={expand ? seeLess : seeMore} style={{ width: 24, height: 24, tintColor: colors.light }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    marginLeft: 16,
    marginBottom: 25,
    backgroundColor: colors.lightDark,
    alignItems: "center",
    paddingBottom: 30,
  },
  portrait: {
    width: 77,
    height: 77,
    borderRadius: 38,
    marginBottom: 16,
    marginTop: 32,
  },
  listIcon: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "50%",
    marginTop: 17,
    marginBottom: 24,
  },
  icon: {
    flex: 1,
    alignItems: "center",
  },
  iconStyle: {
    width: 23,
    height: 23,
    tintColor: colors.gold,
  },
});
