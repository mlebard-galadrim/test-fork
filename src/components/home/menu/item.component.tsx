import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import styled from "styled-components";
import colors from "../../../themes/colors.theme";
import { onShare } from "../../../utils/share.utils";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

const Container = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 20px;
`;

const LeftView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
`;

export const Item = (props) => {
  const navigation = useNavigation();

  return (
    <Container
      onPress={() => {
        props.screen === "ShareApp" ? onShare() : navigation.navigate(props.screen);
      }}
    >
      <LeftView>
        <Image style={styles.iconStyle} source={props.icon} />
        <GoldBrokerText ssp fontSize={18} i18nKey={props.i18nKey} />
      </LeftView>
      <Icon name="chevron-right" size={20} style={{ color: colors.gray }} />
    </Container>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: 24,
    height: 24,
    marginRight: 16,
  },
});
