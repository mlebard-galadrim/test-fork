import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import colors from "../../themes/colors.theme";
import { GoldBrokerText } from "../style/goldbroker-text.component";

export const ViewContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  font-size: 20px;
  padding-bottom: 10px;
  margin-top: 10px;
  border-bottom-width: ${(props) => (props.noborder ? 0 : 1)}px;
  border-bottom-color: ${colors.lightDark};
`;

export const RightSideView = styled(View)`
  flex: 1;
  justify-content: space-evenly;
`;

export const Publication = (props) => {
  let iconUrl = { uri: props.illustration };
  const publication = props.publication;
  const navigation = useNavigation<StackNavigationProp<any>>();

  const goToPublication = () => {
    if (publication.type === "video") {
      navigation.push("VideoPublicationScreen", { publication });
    } else {
      navigation.push("TextPublicationScreen", { publication });
    }
  };

  return (
    <ViewContainer noborder={props.noborder}>
      <TouchableOpacity onPress={goToPublication} style={{ flex: 1, flexDirection: "row" }}>
        <Image
          style={{
            width: 150,
            height: 100,
            resizeMode: "cover",
            borderRadius: 4,
            marginRight: 20,
          }}
          source={iconUrl}
        />
        <RightSideView>
          <GoldBrokerText left ssp fontSize={18} value={props.title} />
          <GoldBrokerText left ssp ls fontSize={10} value={props.author.toUpperCase()} />
        </RightSideView>
      </TouchableOpacity>
    </ViewContainer>
  );
};
