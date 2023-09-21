import { Text, TouchableOpacity, View } from "react-native";

import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { LightButton } from "../../generic/buttons/light-button.component";
import React from "react";
import { State } from "../../../store/configure.store";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

export const BecomeClient = () => {
  const navigation = useNavigation();
  useSelector((state: State) => state.appStore.locale);

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          marginHorizontal: 35,
        }}
      >
        <GoldBrokerText i18nKey="profile.login.become_client.title" fontSize={32} mb={24} />
        <Text style={{ textAlign: "center" }}>
          <GoldBrokerText i18nKey="profile.login.become_client.body" ssp fontSize={17} mb={24} />
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          marginHorizontal: 70,
          justifyContent: "flex-end",
          marginBottom: 50,
        }}
      >
        <LightButton
          large
          ph={20}
          fontSize={20}
          i18nKey="account.createAccount"
          onPress={() => navigation.navigate("RegisterNavigator")}
        />
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")} style={{ marginTop: 42 }}>
          <GoldBrokerText sspB fontSize={17} i18nKey="account.login" />
        </TouchableOpacity>
      </View>
    </>
  );
};
