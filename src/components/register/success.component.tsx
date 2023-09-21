import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { LightButton } from "../generic/buttons/light-button.component";
import { GoldBrokerText } from "../style/goldbroker-text.component";

const checkIcon = require(`../../../assets/icons/check/icons-check.png`);

export const SuccessRegisterStep = () => {
  const navigation = useNavigation();

  const backToHome = () => {
    navigation.navigate("HomeScreen");
  };
  return (
    <View style={{ flex: 1, justifyContent: "space-between" }}>
      <View style={styles.textView}>
        <Image style={{ width: 62, height: 62, resizeMode: "contain" }} source={checkIcon} />
        <GoldBrokerText i18nKey="register.success.congratulations" fontSize={32} mb={24} />
        <GoldBrokerText i18nKey="register.success.informations" ssp fontSize={17} mb={24} />
        <GoldBrokerText i18nKey="register.success.details" ssp fontSize={17} mb={24} />
      </View>
      <View
        style={{
          flex: 0.5,
          justifyContent: "flex-end",
          marginBottom: 60,
        }}
      >
        <LightButton
          large
          i18nKey="register.success.button2"
          fontSize={20}
          onPress={() => {
            navigation.navigate("LoginScreen");
          }}
          mh={60}
          mb={42}
        />

        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate("Profile");
          }}
        >
          <GoldBrokerText
            fontSize={17}
            i18nKey="register.success.button2"
            sspM
          />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textView: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    flex: 1,
  },
});
