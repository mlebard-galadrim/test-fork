import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useSelector } from "react-redux";
import CurrencyPickerComponent from "../../../../../components/generic/picker/currency-picker.component";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import BillListItemComponent from "../../../../../components/profile/bills/bill-list-component";
import { CurrentMoney } from "../../../../../components/profile/side-menu/current-money.component";
import { State } from "../../../../../store/configure.store";
import { loadInvoices } from "../../../../../utils/profileData.utils";

export const BillsScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState<string>("EUR");
  const [fetching, setFetching] = useState<boolean>(false);
  const invoices = useSelector((state: State) => state.invoiceStore.invoices);

  useEffect(() => {
    loadInvoices(selected);
  }, [selected]);

  const onRefresh = () => {
    setFetching(true);
    loadInvoices(selected).then(() => {
      setFetching(false);
    });
  };

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
          title: "profile.menu.bills",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
        mb={30}
      />
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <CurrentMoney />
      </View>
      <CurrencyPickerComponent notitle selected={selected} setSelected={setSelected} />
      <View style={{ paddingBottom: 35, marginTop: 20, flex: 1 }}>
        <FlatList
          data={invoices}
          onRefresh={onRefresh}
          refreshing={fetching}
          keyExtractor={(item, index) => `bill-list-${index}`}
          renderItem={({ item }) => <BillListItemComponent bill={item} currency={selected} />}
          refreshControl={<RefreshControl refreshing={fetching} onRefresh={onRefresh} title="Pull to refresh" tintColor="#fff" titleColor="#fff" />}
        />
      </View>
    </View>
  );
};
