import { Image, StyleSheet, View } from "react-native";

import { GoldBrokerText } from "../../../components/style/goldbroker-text.component";
import { LightButton } from "../../../components/generic/buttons/light-button.component";
import { Logo } from "../../../components/generic/logo.component";
import React from "react";
import colors from "../../../themes/colors.theme";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/native";

const Container = styled(View)`
  background-color: ${colors.dark};
  display: flex;
  flex: 1;
  align-items: center;
`;

const checkIcon = require(`../../../../assets/icons/check/icons-check.png`);

export const NewsletterSuccessScreen = () => {
  const navigation = useNavigation();

  const backToHome = () => {
    navigation.navigate("BottomTabScreens");
  };

  return (
    <Container>
      <Logo top={24} />
      <View style={styles.textView}>
        <Image
          style={{ width: 62, height: 62, resizeMode: "contain" }}
          source={checkIcon}
        />
        <GoldBrokerText
          i18nKey="leftMenu.submenus.newsletter.success.thanks"
          fontSize={32}
          mb={24}
        />
        <GoldBrokerText
          i18nKey="leftMenu.submenus.newsletter.success.body"
          ssp
          fontSize={17}
          mb={24}
        />
      </View>
      <View style={styles.buttonView}>
        <LightButton
          large
          flex
          i18nKey="leftMenu.submenus.newsletter.success.backToApp"
          fontSize={20}
          onPress={() => {
            backToHome();
          }}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  textView: {
    marginTop: 180,
    alignItems: "center",
    marginHorizontal: 38,
    flex: 1,
  },
  buttonView: {
    marginBottom: 62,
    flexDirection: "row",
    marginHorizontal: 62,
  },
});
