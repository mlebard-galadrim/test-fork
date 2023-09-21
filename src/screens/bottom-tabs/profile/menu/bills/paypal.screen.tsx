import { deviceHeight, deviceWidth } from "../../../../../constants/device.constant";

import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React from "react";
import { View } from "react-native";
import WebView from "react-native-webview";
import { useSelector } from "react-redux";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import { State } from "../../../../../store/configure.store";

export const PaypalScreen = ({ route }) => {
  const { invoiceNumber, paypalURI } = route.params;
  const navigation = useNavigation();
  const jwtToken = useSelector((state: State) => state.authStore.token);

  const handleWebViewNavigationStateChange = (newNavState) => {
    if (newNavState.url.includes("/payments/paypal/done")) {
      const url = newNavState.url;
      try {
        (async () => {
          const { data } = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          navigation.navigate("PaymentSuccessScreen", { bill: data });
        })();
      } catch {
        navigation.navigate("BillsScreen");
      }
      return false;
    }
    return true;
  };

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
          type: "rawtext",
          title: "Paypal",
        }}
      />
      <WebView
        style={{ height: deviceHeight - 100, width: deviceWidth }}
        javaScriptEnabled={true}
        source={{ uri: paypalURI }}
        onShouldStartLoadWithRequest={(req) => handleWebViewNavigationStateChange(req)}
      />
    </View>
  );
};
