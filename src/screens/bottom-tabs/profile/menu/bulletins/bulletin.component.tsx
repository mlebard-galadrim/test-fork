import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import { GoldBrokerText } from "../../../../../components/style/goldbroker-text.component";
import colors from "../../../../../themes/colors.theme";

export const ViewContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  font-size: 20px;
  margin-top: 10px;
  border-bottom-width: ${(props) => (props.noborder ? 0 : 1)}px;
  border-bottom-color: ${colors.lightDark};
  background-color: ${colors.gray2};
`;

export const RightSideView = styled(View)`
  flex: 1;
  justify-content: space-evenly;
`;

export const Bulletin = (props) => {
  return (
    <ViewContainer noborder={false}>
      <TouchableOpacity onPress={() => props.handleDownload()} style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Image
          style={{
            width: 150,
            height: 100,
            resizeMode: "cover",
            borderRadius: 4,
            marginRight: 20,
          }}
          source={{ uri: props.illustration }}
        />
        <RightSideView>
          <GoldBrokerText left ssp fontSize={18} color={colors.gold} value={props.title} />
          <GoldBrokerText left ssp fontSize={10} color={colors.gold} nblines={2} value={props.description} />
        </RightSideView>
        <View>
          <Image style={styles.iconStyle} source={require(`../../../../../../assets/icons/profile/icons-espace-client-download.png`)} />
        </View>
      </TouchableOpacity>
    </ViewContainer>
  );
};

const styles = StyleSheet.create({
  iconStyle: {
    width: 24,
    height: 24,
    marginRight: 10,
    marginLeft: 16,
    // marginVertical: "auto",
    tintColor: colors.gold,
  },
});
