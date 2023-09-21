import { useNavigation } from "@react-navigation/native";
import i18n from "i18n-js";
import React, { useState } from "react";
import { Keyboard, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { LightButton } from "../../../components/generic/buttons/light-button.component";
import { Logo } from "../../../components/generic/logo.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { GoldbrokerInput } from "../../../components/style/goldbroker-input.component";
import { GoldBrokerText } from "../../../components/style/goldbroker-text.component";
import { createSubscription } from "../../../services/newsletter.service";
import { State, Store } from "../../../store/configure.store";
import AppSlice from "../../../store/slices/app.slice";
import colors from "../../../themes/colors.theme";
import { validateEmail } from "../../../utils/regex.util";

const Container = styled(View)`
  background-color: ${colors.dark};
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding-bottom: 62px;
`;

export const NewsletterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const firstlaunch = useSelector((state: State) => state.appStore.firstlaunch);

  const registerToNewsletter = (email) => {
    if (validateEmail(email)) {
      createSubscription(email)
        .then(() => {
          firstlaunch ?? Store.dispatch(AppSlice.actions.setFirstLaunch(false));
          Keyboard.dismiss();
          navigation.navigate("NewsletterSuccessScreen");
        })
        .catch((e) => {
          setError(i18n.t("leftMenu.submenus.newsletter.fail.alreadySubscribed"));
        });
    } else {
      setError(i18n.t("leftMenu.submenus.newsletter.fail.invalidMail"));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <TopBar
          left={
            firstlaunch
              ? undefined
              : {
                  type: "buttonIcon",
                  source: "chevron-left",
                  function: () => {
                    navigation.goBack();
                  },
                }
          }
        />
        <Logo top={24} />
        <View style={{ alignItems: "center", marginHorizontal: 30 }}>
          <GoldBrokerText i18nKey="leftMenu.submenus.newsletter.screenTitle" fontSize={32} mb={24} />
          <GoldBrokerText i18nKey="leftMenu.submenus.newsletter.body" ssp fontSize={17} mb={24} />
          <GoldbrokerInput placeholder="Votre mail" onChange={setEmail} error={error} value={email} />
        </View>
        <View>
          <LightButton
            large
            i18nKey="account.subscribe"
            fontSize={20}
            ph={60}
            mb={42}
            onPress={() => {
              registerToNewsletter(email);
            }}
          />
          {firstlaunch && (
            <TouchableOpacity
              onPress={() => {
                Store.dispatch(AppSlice.actions.setFirstLaunch(false));
                navigation.navigate("BottomTabScreens");
              }}
            >
              <GoldBrokerText fontSize={17} i18nKey="leftMenu.submenus.newsletter.subscribeLater" sspM />
            </TouchableOpacity>
          )}
        </View>
      </Container>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  imageStyle: {
    width: 158,
    height: 60,
    marginTop: 24,
    marginBottom: 96,
  },
});
