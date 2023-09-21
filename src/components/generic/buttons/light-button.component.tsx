import React from "react";
import { FlexAlignType, TouchableOpacity } from "react-native";
import colors from "../../../themes/colors.theme";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

type LightButtonProps = {
  flex?: boolean;
  large?: boolean;
  ph?: number;
  mh?: number;
  mb?: number;
  fontSize?: number;
  inactive?: boolean;
  i18nKeySubtitle?: string;
  onPress: () => void;
  i18nKey: string;
};

export const LightButton = (props: LightButtonProps) => {
  const buttonStyle = {
    flex: 0,
    borderRadius: 50,
    backgroundColor: colors.gold,
    padding: 10,
    paddingHorizontal: 10,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5,
    alignSelf: "center" as FlexAlignType,
  };
  let textColor = colors.dark;

  if (props.flex) {
    buttonStyle.flex = 1;
  }

  if (props.large) {
    buttonStyle.padding = 18;
  }

  if (props.ph) {
    buttonStyle.paddingHorizontal = props.ph;
  }

  if (props.mh) {
    buttonStyle.marginLeft = props.mh;
    buttonStyle.marginRight = props.mh;
  }

  if (props.mb) {
    buttonStyle.marginBottom = props.mb;
  }

  if (props.inactive === true) {
    buttonStyle.backgroundColor = colors.inactive;
    textColor = colors.inactiveText;
  }

  return (
    <TouchableOpacity disabled={props.inactive === true} style={buttonStyle} onPress={props.onPress}>
      <GoldBrokerText color={textColor} i18nKey={props.i18nKey} fontSize={props.fontSize ?? 16} sspB />
      {props.i18nKeySubtitle && <GoldBrokerText ssp black i18nKey={props.i18nKeySubtitle} fontSize={15} />}
    </TouchableOpacity>
  );
};
