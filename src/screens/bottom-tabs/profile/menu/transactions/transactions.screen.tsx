import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { useSelector } from "react-redux";
import CurrencyPickerComponent from "../../../../../components/generic/picker/currency-picker.component";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import { CurrentMoney } from "../../../../../components/profile/side-menu/current-money.component";
import TransactionListItemComponent from "../../../../../components/profile/transaction/transaction-list-component";
import { State } from "../../../../../store/configure.store";
import { loadTransactions } from "../../../../../utils/profileData.utils";

export const TransactionsScreen = () => {
  const navigation = useNavigation();

  const [selected, setSelected] = useState<string>("EUR");

  const transactions = useSelector((state: State) => state.transactionStore.transactions);

  useEffect(() => {
    loadTransactions(selected);
  }, [selected]);

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
          title: "profile.menu.my_transactions",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      <View style={{ alignItems: "center", marginBottom: 24 }}>
        <CurrentMoney />
      </View>
      <CurrencyPickerComponent notitle selected={selected} setSelected={setSelected} />
      <View style={{ paddingBottom: 35, marginTop: 20, flex: 1 }}>
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => `bill-list-${index}`}
          renderItem={({ item }) => <TransactionListItemComponent transaction={item} currency={selected} />}
        />
      </View>
    </View>
  );
};
