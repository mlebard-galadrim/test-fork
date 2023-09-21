import React from "react";
import { Image } from "react-native";
import { useSelector } from "react-redux";
import { State } from "../../store/configure.store";

const logoFR = require("../../../assets/logo/orfr-header-logo.png");
const logoEN = require("../../../assets/logo/goldbroker-header-logo.png");
export const Logo = (props) => {
  const locale = useSelector((state: State) => state.appStore.locale);

  if (locale === "fr") {
    return (
      <Image
        source={logoFR}
        style={{
          alignSelf: "center",
          position: "absolute",
          top: props.top ?? 15,
          width: 160,
          resizeMode: "contain",
          height: 20,
        }}
      />
    );
  } else {
    return (
      <Image
        source={logoEN}
        style={{
          alignSelf: "center",
          position: "absolute",
          top: props.top ?? 14,
          width: 160,
          resizeMode: "contain",
          height: 20,
        }}
      />
    );
  }
};
