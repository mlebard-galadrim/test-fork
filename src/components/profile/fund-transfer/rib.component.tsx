import { FontAwesome5 } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { environment } from "../../../environments";
import { UseDownload } from "../../../hooks/useDownload";
import colors from "../../../themes/colors.theme";
import { LightButton } from "../../generic/buttons/light-button.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

type RibComponentProps = {
  bankInformation: {
    bank_address: string;
    bank_name: string;
    bic_swift: string;
    currency: string;
    iban: string;
    intermediary_bank: string;
    number: string;
    owner_address: string;
    owner_name: string;
  };
  selected: string;
};

export default function RibComponent({ bankInformation, selected }: RibComponentProps) {
  if (bankInformation === null) {
    return null;
  }

  const { downloadFile } = UseDownload();

  const copyToClipboard = (content: string) => {
    Clipboard.setString(content);
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 17 }}>
        <GoldBrokerText fontSize={18} i18nKey="profile.fund_transfer.bank_coor" />
        <GoldBrokerText fontSize={18} mb={17} value={` (${selected})`} />
      </Text>
      {bankInformation.owner_name ? (
        <>
          <GoldBrokerText fontSize={16} mb={4} ssp i18nKey="profile.fund_transfer.titular" />
          <GoldBrokerText fontSize={16} mb={16} sspL left value={bankInformation.owner_name} />
        </>
      ) : null}
      {bankInformation.owner_address ? (
        <>
          <GoldBrokerText fontSize={16} mb={4} ssp i18nKey="profile.fund_transfer.titular_address" />
          <GoldBrokerText fontSize={16} sspL mb={16} left value={bankInformation.owner_address} />
        </>
      ) : null}
      {bankInformation.bank_name ? (
        <>
          <GoldBrokerText fontSize={16} mb={4} ssp i18nKey="profile.fund_transfer.bank_name" />
          <GoldBrokerText fontSize={16} sspL left mb={16} value={bankInformation.bank_name} />
        </>
      ) : null}
      {bankInformation.bank_address ? (
        <>
          <GoldBrokerText fontSize={16} mb={4} ssp i18nKey="profile.fund_transfer.bank_address" />
          <GoldBrokerText fontSize={16} sspL left mb={16} value={bankInformation.bank_address} />
        </>
      ) : null}
      {bankInformation.number ? (
        <TouchableOpacity
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => {
            copyToClipboard(bankInformation.number);
          }}
        >
          <View>
            <GoldBrokerText left fontSize={16} mb={4} ssp i18nKey="profile.fund_transfer.account_number" />
            <GoldBrokerText fontSize={16} sspL left mb={16} value={bankInformation.number} />
          </View>
          <FontAwesome5 name="clipboard" size={16} color="white" />
        </TouchableOpacity>
      ) : null}
      {bankInformation.iban ? (
        <TouchableOpacity
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => {
            copyToClipboard(bankInformation.iban);
          }}
        >
          <View>
            <GoldBrokerText left fontSize={16} mb={4} ssp i18nKey="profile.fund_transfer.iban" />
            <GoldBrokerText fontSize={16} sspL left mb={16} value={bankInformation.iban} />
          </View>
          <FontAwesome5 name="clipboard" size={16} color="white" />
        </TouchableOpacity>
      ) : null}
      {bankInformation.bic_swift ? (
        <TouchableOpacity
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onPress={() => {
            copyToClipboard(bankInformation.bic_swift);
          }}
        >
          <View>
            <GoldBrokerText left fontSize={16} mb={4} ssp i18nKey="profile.fund_transfer.swift" />
            <GoldBrokerText fontSize={16} sspL left mb={16} value={bankInformation.bic_swift} />
          </View>
          <FontAwesome5 name="clipboard" size={16} color="white" />
        </TouchableOpacity>
      ) : null}
      {bankInformation.intermediary_bank ? (
        <>
          <GoldBrokerText fontSize={16} mb={4} ssp i18nKey="profile.fund_transfer.bank_intermediary" />
          <GoldBrokerText fontSize={16} sspL left mb={16} value={bankInformation.intermediary_bank} />
        </>
      ) : null}

      <LightButton
        i18nKey={"profile.fund_transfer.print"}
        onPress={() => {
          downloadFile("rib.pdf", `${environment.apiUrl}/bank-accounts/${selected}/download`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.lightDark,
    alignItems: "flex-start",
  },
});
