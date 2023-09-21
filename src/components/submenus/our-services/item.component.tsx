import { ImageBackground, ImageSourcePropType, StyleSheet, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

type ServiceItemProps = {
  i18nKey: string;
  picture: ImageSourcePropType;
  contentId: string;
};

export const ServiceItem = ({ i18nKey, picture, contentId }: ServiceItemProps) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate("ServiceScreen", { contentId, i18nKey })}>
      <ImageBackground source={picture} style={styles.image}>
        <GoldBrokerText i18nKey={i18nKey} fontSize={32} />
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    height: 165,
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "center",
  },
});
