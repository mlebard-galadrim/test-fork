import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { settingsTabs, tabs } from "../../../constants/profile/profile-menu-tabs.constant";
import { State, Store } from "../../../store/configure.store";
import AuthSlice from "../../../store/slices/auth.slice";
import PreferencesSlice from "../../../store/slices/preferences.slice";
import colors from "../../../themes/colors.theme";
import { Item } from "./profile-menu-item.component";

const Container = styled(View)`
  flex: 1;
  align-items: center;
`;
const disconnectIcon = require("../../../../assets/icons/profile/menu/settings/icons-espace-client-se-d-connecter.png");

export const ProfileMenu = () => {
  const navigation = useNavigation();
  const address_status = useSelector((state: State) => state.userStore.address_status);
  const bank_account_status = useSelector((state: State) => state.userStore.bank_account_status);
  const identity_status = useSelector((state: State) => state.userStore.identity_status);

  return (
    <Container>
      <View
        style={{
          width: "100%",
          borderBottomColor: colors.transparent2,
          borderBottomWidth: 1,
          marginBottom: 16,
          paddingBottom: 16,
        }}
      >
        {tabs.map((item, key) => {
          if (
            (address_status !== 1 || bank_account_status !== 1 || identity_status !== 1) &&
            (item.i18nKey === "profile.menu.fund_transfer" || item.i18nKey === "profile.menu.property_titles")
          ) {
            return <View key={key}></View>;
          }
          return <Item key={key} i18nKey={item.i18nKey} icon={item.icon} screen={item.screen} />;
        })}
      </View>
      {settingsTabs.map((item, key) => (
        <Item key={key} i18nKey={item.i18nKey} icon={item.icon} screen={item.screen} />
      ))}
      <Item
        i18nKey={"profile.menu.disconnect"}
        icon={disconnectIcon}
        action={() => {
          Store.dispatch(AuthSlice.actions.reset());
          Store.dispatch(PreferencesSlice.actions.reset());
          navigation.navigate("HomeScreen");
        }}
      />
    </Container>
  );
};
