import { Image, StyleSheet, View } from "react-native";

import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { LightButton } from "../../generic/buttons/light-button.component";
import React from "react";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/native";

const checkIcon = require(`../../../../assets/icons/check/icons-check.png`);

const Container = styled(View)`
  display: flex;
  flex: 1;
  align-items: center;
`;

export const PasswordUpdateSuccess = () => {
  const navigation = useNavigation();
  return (
    <Container>
      <View style={styles.textView}>
        <Image
          style={{ width: 62, height: 62, resizeMode: "contain" }}
          source={checkIcon}
        />
        <GoldBrokerText
          i18nKey="profile.passwordUpdate.success.title"
          fontSize={32}
          mb={24}
        />
        <GoldBrokerText
          i18nKey="profile.passwordUpdate.success.body"
          ssp
          fontSize={17}
          mb={24}
        />
      </View>
      <View style={styles.buttonView}>
        <LightButton
          large
          flex
          i18nKey="profile.passwordUpdate.success.button"
          fontSize={20}
          onPress={() => {
            navigation.navigate("DashboardScreen");
          }}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  textView: {
    marginTop: 120,
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
