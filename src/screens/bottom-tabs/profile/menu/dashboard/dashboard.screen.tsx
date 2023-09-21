import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import BandeauComponent from "../../../../../components/profile/dashboard/bandeau-component";
import BillSectionComponent from "../../../../../components/profile/dashboard/bill-component";
import CoinBarSectionComponent from "../../../../../components/profile/dashboard/coin-bar-component";
import MessageSectionComponent from "../../../../../components/profile/dashboard/message-component";
import { State } from "../../../../../store/configure.store";
import { loadProfileInfo } from "../../../../../utils/auth.utils";
import {
  loadInvoices,
  loadInvoicesStatuses,
  loadInvoicesTypes,
  loadProfileStatuses,
  loadTransactionsTypes,
} from "../../../../../utils/profileData.utils";

export const DashboardScreen = () => {
  const navigation = useNavigation();
  const currency = useSelector((state: State) => state.preferencesStore.currency);
  const locale = useSelector((state: State) => state.appStore.locale);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadData = () => {
    setIsLoading(true);
    loadProfileInfo();
    loadInvoicesTypes();
    loadTransactionsTypes();
    loadProfileStatuses();
    loadInvoicesStatuses();
    loadInvoices(currency);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [locale]);

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "three-bars",
          function: () => {
            navigation.navigate("SideMenuScreen");
          },
        }}
        middle={{
          type: "text",
          title: "profile.menu.dashboard",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
        mb={26}
      />
      <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} tintColor={"white"} />}>
        <BandeauComponent />
        <CoinBarSectionComponent />
        <MessageSectionComponent />
        <BillSectionComponent />
      </ScrollView>
    </View>
  );
};
