import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { LightButton } from "../../../../../components/generic/buttons/light-button.component";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import { PaymentDoneRecap } from "../../../../../components/profile/bills/payment/payment-done-recap";
import { GoldBrokerText } from "../../../../../components/style/goldbroker-text.component";
import { State } from "../../../../../store/configure.store";
import { loadInvoices } from "../../../../../utils/profileData.utils";

const Container = styled(View)`
  display: flex;
  flex: 1;
  align-items: center;
`;

const checkIcon = require(`../../../../../../assets/icons/check/icons-check.png`);

export const PaymentSuccessScreen = ({ route }) => {
  const navigation = useNavigation();
  const { bill } = route.params;
  const currency = useSelector((state: State) => state.preferencesStore.currency);
  useEffect(() => {
    loadInvoices(currency);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            navigation.navigate("BillsScreen");
          },
        }}
        middle={{
          type: "text",
          title: "profile.bills.done.confirm_payment",
        }}
      />
      <Container>
        <View style={styles.textView}>
          <Image style={{ width: 62, height: 62, resizeMode: "contain" }} source={checkIcon} />
          <GoldBrokerText i18nKey="profile.bills.done.title" fontSize={28} mh={40} mb={24} />
          <GoldBrokerText i18nKey="profile.bills.done.body" sspL mb={12} fontSize={17} />
        </View>
        {bill ? <PaymentDoneRecap bill={bill} /> : null}
        <View style={{ flex: 1, justifyContent: "center" }}>
          <LightButton
            large
            i18nKey={"profile.bills.done.button"}
            ph={40}
            onPress={() => {
              navigation.navigate("DashboardScreen");
            }}
          />
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  textView: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginBottom: 28,
  },
});
