import React from "react";
import { Image, View } from "react-native";
import styled from "styled-components";
import { GoldBrokerText } from "../style/goldbroker-text.component";

const TitleView = styled(View)`
  flex-direction: row;
  margin-bottom: ${(props) => props.mb ?? 26}px;
  align-items: center;
`;

const puce = require(`../../../assets/puces/puces-main.png`);

export const SectionTitle = (props) => {
  return (
    <TitleView mb={props.mb}>
      <Image source={puce} style={{ width: 9, height: 9, justifyContent: "center" }} />
      <GoldBrokerText ml={8} i18nKey={props.i18nKey} fontSize={props.fontSize ?? 24} />
    </TitleView>
  );
};
