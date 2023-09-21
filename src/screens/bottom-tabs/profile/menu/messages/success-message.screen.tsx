import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import styled from "styled-components";
import { LightButton } from "../../../../../components/generic/buttons/light-button.component";
import { GoldBrokerText } from "../../../../../components/style/goldbroker-text.component";

const Container = styled(View)`
  display: flex;
  flex: 1;
  align-items: center;
`;

const checkIcon = require(`../../../../../../assets/icons/check/icons-check.png`);

export default function SuccessMessageScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      <Container>
        <View style={styles.textView}>
          <Image style={{ width: 62, height: 62, resizeMode: "contain" }} source={checkIcon} />
          <GoldBrokerText i18nKey="contactUs.form.success.title" fontSize={32} mh={20} mb={24} />
          <GoldBrokerText i18nKey="contactUs.form.success.body1" ssp mb={12} fontSize={17} />
          <GoldBrokerText i18nKey="contactUs.form.success.body2" ssp fontSize={17} />
        </View>
      </Container>
      <LightButton
        i18nKey="profile.success_message.button"
        mh={50}
        large
        mb={50}
        onPress={() => navigation.navigate("MessagesScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textView: {
    marginTop: 87,
    alignItems: "center",
    marginHorizontal: 32,
    flex: 1,
  },
});
