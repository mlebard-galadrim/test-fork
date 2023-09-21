import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Modal, View } from "react-native";
import WebView from "react-native-webview";
import { deviceHeight, deviceWidth } from "../../../../constants/device.constant";
import { paymentDone } from "../../../../services/payment.service";

export const ThreeDSecureModal = ({ threeDURL, visible, setVisible, invoice_number }) => {
  const navigation = useNavigation();
  const handleWebViewNavigationStateChange = (newNavState) => {
    if (newNavState.url.includes("/payment/checkout/done")) {
      const url = newNavState.url;

      const regex = /cko-session-id=([^&]*)/g;
      const sessionId = regex.exec(url);

      const params = {
        "cko-session-id": sessionId[1],
      };

      paymentDone(invoice_number, params)
        .then((res) => {
          setVisible(false);
          navigation.navigate("PaymentSuccessScreen", { bill: res });
        })
        .catch((err) => {
          setVisible(false);
          navigation.navigate("BillsScreen");
        });
      return false;
    }
    return true;
  };

  return (
    <View>
      <Modal
        animationType="fade"
        visible={visible}
        transparent={true}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <WebView
            style={{ flex: 1, height: deviceHeight, width: deviceWidth }}
            javaScriptEnabled={true}
            source={{ uri: threeDURL }}
            onShouldStartLoadWithRequest={(req) => handleWebViewNavigationStateChange(req)}
          />
        </View>
      </Modal>
    </View>
  );
};
