import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image } from "react-native";
import styled from "styled-components";
import colors from "../../themes/colors.theme";
import { LightButton } from "../generic/buttons/light-button.component";
import { GoldBrokerText } from "../style/goldbroker-text.component";

const Container = styled.View`
  align-items: center;
  background-color: ${colors.gray2};
  margin: 0px 16px;
  padding: 16px 34px;
  margin-bottom: 28px;
`;

const starIcon = require("../../../assets/icons/more/icons-star-main.png");

export const Review = () => {
  const navigation = useNavigation();
  return (
    <Container>
      <Image source={starIcon} style={{ marginBottom: 8 }} />
      <GoldBrokerText i18nKey="review.title" fontSize={24} mb={12} />
      <GoldBrokerText i18nKey="review.body" center fontSize={17} sspL mb={32} />
      <LightButton
        i18nKey="review.button"
        ph={50}
        large
        fontSize={20}
        onPress={() => navigation.navigate("WriteReviewScreen")}
      />
    </Container>
  );
};
