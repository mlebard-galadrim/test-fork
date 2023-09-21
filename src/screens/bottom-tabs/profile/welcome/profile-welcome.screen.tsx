import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ImageBackground } from "react-native";
import { useSelector } from "react-redux";
import { Logo } from "../../../../components/generic/logo.component";
import { TopBar } from "../../../../components/generic/top-bar.component";
import { BecomeClient } from "../../../../components/profile/welcome-page/become-client.component";
import { PinWelcome } from "../../../../components/profile/welcome-page/pin-welcome.component";
import { State } from "../../../../store/configure.store";

const bgimage = require("../../../../../assets/background-images/background-color-image.png");

export const ProfileWelcomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const auth = useSelector((state: State) => state.authStore);
  const pin = useSelector((state: State) => state.preferencesStore.pin);

  useEffect(() => {
    if (auth.token !== null && pin.length === 0) {
      navigation.navigate("DashboardScreen");
    }
  }, [pin, auth]);

  return (
    <ImageBackground source={bgimage} style={{ flex: 1 }}>
      <Logo />
      <TopBar
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      {auth.token === null ? <BecomeClient /> : <PinWelcome />}
    </ImageBackground>
  );
};
