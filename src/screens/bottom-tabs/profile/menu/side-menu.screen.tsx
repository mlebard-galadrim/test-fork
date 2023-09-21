import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, View } from "react-native";
import styled from "styled-components";
import { Review } from "../../../../components/ads/review-us.component";
import { Logo } from "../../../../components/generic/logo.component";
import { TopBar } from "../../../../components/generic/top-bar.component";
import { SocialNetwork } from "../../../../components/home/menu/social-network.component";
import { ProfileMenu } from "../../../../components/profile/side-menu/profile-menu.component";
import { UserInfoDisplay } from "../../../../components/profile/side-menu/user-info-display.component";

const Container = styled(View)`
  height: 100%;
  display: flex;
`;

export default function SideMenuScreen() {
  const navigation = useNavigation();
  return (
    <Container>
      <Logo />
      <TopBar
        right={{
          type: "buttonIcon",
          source: "x",
          function: () => {
            navigation.goBack();
          },
        }}
        mb={26}
      />
      <ScrollView>
        <UserInfoDisplay />
        <ProfileMenu />
        <Review />
      </ScrollView>
      <SocialNetwork />
    </Container>
  );
}
