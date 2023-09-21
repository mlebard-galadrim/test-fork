import React from "react";
import { Image, View } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { CurrentMoney } from "./current-money.component";

const Container = styled(View)`
  flex: 1;
  align-items: center;
  margin-bottom: 20px;
`;

const ID = styled(View)`
  flex-direction: row;
  border-radius: 4px;
  background-color: ${colors.transGold};
  align-items: center;
  padding: 0px 8px;
  margin-bottom: 28px;
`;

const idIcon = require("../../../../assets/icons/profile/icons-espace-client-id.png");

export const UserInfoDisplay = () => {
  const firstname = useSelector((state: State) => state.userStore.firstname);
  const lastname = useSelector((state: State) => state.userStore.lastname);
  const userId = useSelector((state: State) => state.userStore.userId);

  return (
    <Container>
      <GoldBrokerText value={`${firstname} ${lastname}`} ssp fontSize={16} mb={6} />
      <ID>
        <Image source={idIcon} style={{ marginRight: 10 }} />
        <GoldBrokerText value={`ID #${userId}`} sspL fontSize={20} gold />
      </ID>
      <CurrentMoney />
    </Container>
  );
};
