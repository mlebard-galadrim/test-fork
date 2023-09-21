import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React from "react";
import { Modal, View } from "react-native";
import WebView from "react-native-webview";
import { useSelector } from "react-redux";
import { deviceHeight, deviceWidth } from "../../../../constants/device.constant";
import { State } from "../../../../store/configure.store";

export const ThreeDSecureModal = ({ threeDURL, visible, setVisible, invoice_number }) => {
  const jwtToken = useSelector((state: State) => state.authStore.token);
  const navigation = useNavigation();
  const handleWebViewNavigationStateChange = (newNavState) => {
    if (newNavState.url.includes("/payments/checkout/done")) {
      const url = newNavState.url;
      try {
        (async () => {
          const { data } = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          });
          setVisible(false);
          navigation.navigate("PaymentSuccessScreen", { bill: data });
        })();
      } catch {
        setVisible(false);
        navigation.navigate("BillsScreen");
      }
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
