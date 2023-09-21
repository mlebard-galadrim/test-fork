import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, ImageBackground, StyleSheet, View } from "react-native";
import styled from "styled-components";
import { LightButton } from "../generic/buttons/light-button.component";
import { GoldBrokerText } from "../style/goldbroker-text.component";

const checkIcon = require(`../../../assets/icons/check/icons-check.png`);
const bgimage = require("../../../assets/background-images/contact-background.png");

const Container = styled(View)`
  display: flex;
  flex: 1;
  align-items: center;
`;
export const ContactSuccess = () => {
  const navigation = useNavigation();
  return (
    <ImageBackground source={bgimage} style={{ flex: 1 }}>
      <Container>
        <View style={styles.textView}>
          <Image style={{ width: 62, height: 62, resizeMode: "contain" }} source={checkIcon} />
          <GoldBrokerText i18nKey="contactUs.form.success.title" fontSize={28} mh={40} mb={24} />
          <GoldBrokerText i18nKey="contactUs.form.success.body1" ssp mb={12} fontSize={17} />
          <GoldBrokerText i18nKey="contactUs.form.success.body2" ssp fontSize={17} />
        </View>
        <View style={styles.buttonView}>
          <LightButton
            large
            i18nKey="contactUs.form.success.button"
            mh={34}
            fontSize={18}
            onPress={() => {
              navigation.navigate("HomeScreen");
            }}
          />
        </View>
      </Container>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  textView: {
    marginTop: 87,
    alignItems: "center",
    marginHorizontal: 32,
    flex: 1,
  },
  buttonView: {
    flex: 1,
    justifyContent: "center",
  },
});
