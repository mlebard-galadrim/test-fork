import { GoldBrokerText } from "../style/goldbroker-text.component";
import { LightButton } from "../generic/buttons/light-button.component";
import React from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

export const CreateAccountAd = () => {
  const navigation = useNavigation();
  return (
    <View
      style={{
        backgroundColor: "#2e2e2e",
        paddingTop: 46,
        paddingBottom: 46,
      }}
    >
      <GoldBrokerText fontSize={32} mb={32} mh={20} i18nKey="account.invest" />
      <LightButton
        large
        i18nKey="account.createAccount"
        mh={34}
        fontSize={20}
        onPress={() => {
          navigation.navigate("RegisterNavigator");
        }}
      />
    </View>
  );
};
