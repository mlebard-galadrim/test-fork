import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import { LightButton } from "../../generic/buttons/light-button.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

export const PinWelcome = () => {
  const navigation = useNavigation();
  const locale = useSelector((state: State) => state.appStore.locale);

  useEffect(() => {}, [locale]);

  return (
    <>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          marginHorizontal: 35,
        }}
      >
        <GoldBrokerText i18nKey="profile.login.pin_welcome.title" fontSize={32} mb={24} />
        <Text style={{ textAlign: "center" }}>
          <GoldBrokerText i18nKey="profile.login.pin_welcome.body" ssp fontSize={17} mb={24} />
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
          ph={25}
          fontSize={20}
          i18nKey="profile.login.pin_welcome.button"
          onPress={() => {
            navigation.navigate("PinLogin");
          }}
        />
      </View>
    </>
  );
};
