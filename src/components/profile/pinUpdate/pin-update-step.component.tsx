import React from "react";
import { Image, View } from "react-native";
import styled from "styled-components";
import colors from "../../../themes/colors.theme";
import { PinBar } from "../../generic/pin/pinbar.component";
import { PinGrid } from "../../generic/pin/pingrid.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

const pinIcone = require("../../../../assets/icons/register/icons-pincode.png");

const Container = styled(View)`
  flex: 1;
  width: 100%;
  align-items: center;
`;

const FormContainer = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: space-evenly;
`;

export const PinUpdateStep = ({ pin, setPin, instruction, detail = "", error = "" }) => {
  return (
    <Container>
      <View style={{ marginHorizontal: 50, alignItems: "center" }}>
        <Image source={pinIcone} style={{ marginBottom: 17 }} />
        <GoldBrokerText i18nKey={instruction} ssp fontSize={17} />
        <GoldBrokerText i18nKey={detail} sspL fontSize={14} />
        {error.length > 0 && <GoldBrokerText i18nKey={error} sspL fontSize={12} color={colors.danger} />}
      </View>
      <FormContainer>
        <PinBar pin={pin} />
        <PinGrid pin={pin} setPin={setPin} />
      </FormContainer>
    </Container>
  );
};
