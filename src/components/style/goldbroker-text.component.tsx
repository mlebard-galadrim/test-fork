import i18n from "i18n-js";
import React from "react";
import { Text } from "react-native";
import colors from "../../themes/colors.theme";

export const GoldBrokerText = (props) => {
  let textStyle = {
    color: colors.white,
    fontSize: 20,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    marginTop: 0,
    fontFamily: "PlayfairDisplayRegular",
    textAlign: "center" as "auto" | "left" | "right" | "center" | "justify",
    flex: 0,
    letterSpacing: 0,
    lineHeight: 24,
    height: undefined,
    textDecorationLine: undefined,
    flexWrap: "nowrap" as "wrap" | "nowrap" | "wrap-reverse",
  };

  if (props.flex) {
    textStyle.flex = 1;
  }

  if (props.height) {
    textStyle.height = props.height;
  }

  if (props.color) {
    textStyle.color = props.color;
  } else if (props.gold) {
    textStyle.color = colors.gold;
  } else if (props.black) {
    textStyle.color = colors.dark;
  } else if (props.green) {
    textStyle.color = colors.success;
  } else if (props.gray) {
    textStyle.color = colors.gray;
  }

  if (props.ssp) {
    textStyle.fontFamily = "SSPMedium";
  } else if (props.sspM) {
    textStyle.fontFamily = "SSPBold";
  } else if (props.sspB) {
    textStyle.fontFamily = "SSPBlack";
  } else if (props.sspL) {
    textStyle.fontFamily = "SSPRegular";
  }

  if (props.left) {
    textStyle.textAlign = "left";
  } else if (props.right) {
    textStyle.textAlign = "right";
  } else if (props.justify) {
    textStyle.textAlign = "justify";
  }

  if (props.fontSize) {
    textStyle.fontSize = props.fontSize;
  }

  if (props.mb) {
    textStyle.marginBottom = props.mb;
  }

  if (props.ml) {
    textStyle.marginLeft = props.ml;
  }

  if (props.mr) {
    textStyle.marginRight = props.mr;
  }

  if (props.mt) {
    textStyle.marginTop = props.mt;
  }

  if (props.mh) {
    textStyle.marginLeft = props.mh;
    textStyle.marginRight = props.mh;
  }

  if (props.ls) {
    textStyle.letterSpacing = 1.6;
  }

  if (props.underline) {
    textStyle.textDecorationLine = "underline";
  }
  if (props.wrap) {
    textStyle.flexWrap = "wrap";
  }

  let value = props.value;
  let key = props.i18nKey;

  if (props.uppercase) {
    value = `${value}`.toUpperCase();
  }

  textStyle.lineHeight = textStyle.fontSize + 4;

  if (props.lh) {
    textStyle.lineHeight = props.lh;
  }

  return (
    <Text style={{ ...textStyle, ...props.style }} numberOfLines={props.nblines ?? undefined} ellipsizeMode="tail">
      {Boolean(key) ? i18n.t(key) : value}
    </Text>
  );
};
