import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { State } from "../../store/configure.store";
import colors from "../../themes/colors.theme";
import { formatCurrency } from "../../utils/currencies.utils";
import { GoldBrokerText } from "../style/goldbroker-text.component";
import { Performance } from "../style/performance.component";

export const ViewContainer = styled(TouchableOpacity)`
  display: flex;
  flex: 1;
  background-color: ${colors.lightDark};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 25px;
  font-size: 20px;
  margin-bottom: 5px;
`;

const goldIcon = require(`../../../assets/icons/metals/or.png`);
const silverIcon = require(`../../../assets/icons/metals/argent.png`);

type Props = {
  value: number;
  performance: number;
  metal: string;
};

export const MetalRate = (props: Props) => {
  const navigation = useNavigation();
  const currency = useSelector((state: State) => state.preferencesStore.currency);

  if (props.value === undefined || props.performance === undefined) return null;

  return (
    <ViewContainer
      onPress={() =>
        navigation.navigate("Graphics", {
          metal: props.metal === "or" ? "XAU" : "XAG",
        })
      }
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={{
            width: 30,
            height: 30,
            resizeMode: "contain",
            marginRight: 24,
          }}
          source={props.metal === "or" ? goldIcon : silverIcon}
        />
        <GoldBrokerText value={formatCurrency(currency, props.value.toFixed(2))} ssp />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Performance performance={props.performance} size={18} />
        <Icon name="chevron-right" size={25} style={{ color: colors.gray }} />
      </View>
    </ViewContainer>
  );
};
