import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import i18n from "i18n-js";
import React, { useEffect, useState } from "react";
import { Alert, Image, Linking, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { twitterXIcon } from "../../../constants/icon.constant";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";

const Container = styled(View)`
  background-color: ${colors.lightDark};
  align-items: center;
  padding: 20px;
`;

const IconList = styled(View)`
  flex-direction: row;
  align-items: center;
`;

export const SocialNetwork = () => {
  const locale = useSelector((state: State) => state.appStore.locale);
  const [socialNetworkList, setSocialNetworkList] = useState([]);

  useEffect(() => {
    setSocialNetworkList([
      {
        icon: "twitter",
        url: i18n.t("socialNetworks.twitter"),
      },
      {
        icon: "instagram",
        url: i18n.t("socialNetworks.instagram"),
      },
      {
        icon: "linkedin-square",
        url: i18n.t("socialNetworks.linkedin"),
      },
      {
        icon: "facebook-square",
        url: i18n.t("socialNetworks.facebook"),
      },
      {
        icon: "youtube",
        url: i18n.t("socialNetworks.youtube"),
      },
      {
        icon: "telegram",
        url: i18n.t("socialNetworks.telegram"),
      },
    ]);
  }, [locale]);

  //const socialNetworkList = socialNetworks[locale];

  const handlePress = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL ${url}`);
    }
  };

  return (
    <Container>
      <IconList>
        {socialNetworkList.map((item, key) => {
          return (
            <TouchableOpacity
              key={key}
              onPress={() => {
                handlePress(item.url);
              }}
              style={{ marginHorizontal: 15 }}
            >
              {item.icon === "telegram" ? (
                <FontAwesome5 name={item.icon} size={24} color={colors.gold} />
              ) : item.icon === "twitter" ? (
                <Image style={styles.iconStyle} source={twitterXIcon} />
              ) : (
                <AntDesign name={item.icon} size={24} color={colors.gold} />
              )}
            </TouchableOpacity>
          );
        })}
      </IconList>
    </Container>
  );
};
const styles = StyleSheet.create({
  iconStyle: {
    width: 23,
    height: 23,
    tintColor: colors.gold,
  },
});
