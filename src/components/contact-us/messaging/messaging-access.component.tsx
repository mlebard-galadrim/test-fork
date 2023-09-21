import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import { useLogin } from "../../../hooks/useLogin";
import { LightButton } from "../../generic/buttons/light-button.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

const Container = styled(View)`
  display: flex;
  flex: 1;
  align-items: center;
`;

const messageIcon = require(`../../../../assets/icons/message/icons-message.png`);
const bgimage = require("../../../../assets/background-images/contact-background.png");

export const MessagingWelcome = () => {
  const navigation = useNavigation();
  const { logged } = useLogin();

  const onCreateAccount = () => {
    navigation.navigate("RegisterNavigator");
  };
  const onLogin = () => {
    navigation.navigate("LoginScreen");
  };

  return (
    <ImageBackground source={bgimage} style={{ flex: 1 }}>
      <Container>
        <View style={styles.textView}>
          <Image style={{ width: 32, height: 32, resizeMode: "contain" }} source={messageIcon} />
          <GoldBrokerText i18nKey="contactUs.securedMessaging.title" fontSize={24} mt={22} mh={40} mb={24} />
          <GoldBrokerText i18nKey="contactUs.securedMessaging.body" ssp mb={12} fontSize={17} />
        </View>
        <View style={{ marginBottom: 62 }}>
          {!logged ? (
            <>
              <LightButton large ph={50} fontSize={20} i18nKey="account.createAccount" onPress={onCreateAccount} />
              <TouchableOpacity onPress={onLogin} style={{ marginTop: 42 }}>
                <GoldBrokerText sspB fontSize={17} i18nKey="account.login" />
              </TouchableOpacity>
            </>
          ) : (
            <LightButton
              large
              ph={50}
              fontSize={20}
              i18nKey="contactUs.securedMessaging.accessMessagingButton"
              onPress={() => {
                navigation.navigate("Profile", { screen: "MessagesScreen" });
              }}
            />
          )}
        </View>
      </Container>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  textView: {
    marginTop: 80,
    alignItems: "center",
    marginHorizontal: 32,
    flex: 1,
  },
});
