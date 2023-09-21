import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View } from "react-native";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import { CardComponent } from "../../../../../components/profile/bills/checkout/card.component";

export const CheckoutScreen = ({ route }) => {
  const { invoice_number, use_balance } = route.params;

  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            navigation.goBack();
          },
        }}
        middle={{
          type: "text",
          title: "profile.bills.recap.payment.card",
        }}
      />
      <CardComponent {...{ invoice_number, use_balance }} />
    </View>
  );
};
