import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import styled from "styled-components";
import { LightButton } from "../../components/generic/buttons/light-button.component";
import { GoldBrokerText } from "../../components/style/goldbroker-text.component";
import colors from "../../themes/colors.theme";

const Container = styled.View`
  background-color: ${colors.dark};
  display: flex;
  flex: 1;
  align-items: center;
`;

const checkIcon = require(`../../../assets/icons/check/icons-check.png`);

export const ForgottenPasswordSuccessScreen = () => {
  const navigation = useNavigation();

  return (
    <Container>
      <View style={styles.textView}>
        <Image style={{ width: 62, height: 62, resizeMode: "contain" }} source={checkIcon} />
        <GoldBrokerText i18nKey={"profile.login.forgotten_password_form.detail"} fontSize={17} mb={26} ssp />
      </View>
      <View style={styles.buttonView}>
        <LightButton
          large
          i18nKey="profile.login.forgotten_password_form.successButton"
          mh={24}
          ph={22}
          fontSize={18}
          onPress={() => {
            navigation.navigate("HomeScreen");
          }}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  textView: {
    justifyContent: "center",
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
