import React from "react";
import { ScrollView, View } from "react-native";
import CurrencyPickerComponent from "../../../../../components/generic/picker/currency-picker.component";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import InformationComponent from "../../../../../components/profile/fund-transfer/information.component";
import RibComponent from "../../../../../components/profile/fund-transfer/rib.component";
import { UseFundTransfer } from "./useFundTransfer";

export const FundTransferScreen = () => {
  const { navigation, selected, setSelected, bankInformation } = UseFundTransfer();

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
          title: "profile.menu.fund_transfer",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
      />
      <ScrollView>
        <CurrencyPickerComponent selected={selected} setSelected={setSelected} />
        <RibComponent bankInformation={bankInformation} selected={selected} />
        <InformationComponent />
      </ScrollView>
    </View>
  );
};
