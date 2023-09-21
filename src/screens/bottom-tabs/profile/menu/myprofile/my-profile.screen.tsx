import i18n from "i18n-js";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { FormInput } from "../../../../../components/contact-us/form/contact-form.component";
import { LightButton } from "../../../../../components/generic/buttons/light-button.component";
import { TopBar } from "../../../../../components/generic/top-bar.component";
import { CountryPicker } from "../../../../../components/picker/countryPicker.component";
import { GoldBrokerText } from "../../../../../components/style/goldbroker-text.component";
import { CountryFlags } from "../../../../../constants/country-names.constant";
import { State } from "../../../../../store/configure.store";
import colors from "../../../../../themes/colors.theme";
import { AttachmentComponent } from "./attachment.component";
import { useMyProfile } from "./useMyProfile";

const ProfileBlock = styled(View)`
  background-color: ${colors.lightDark};
  margin-top: 26px;
  padding: 16px 12px;
`;

const Address = styled(View)`
  background-color: rgba(255, 187, 58, 0.1);
  margin-top: 13px;
  padding: 16px 12px;
`;
const UpdateInformation = styled(TouchableOpacity)`
  background-color: rgba(118, 189, 255, 0.16);
  padding: 16px 12px;
  border-radius: 4px;
  flex-direction: row;
  align-items: flex-start;
`;

const toDoIcon = require("../../../../../../assets/icons/profile/icons-espace-client-info.png");

export const MyProfileScreen = () => {
  const {
    navigation,
    titleColors,
    countryCode,
    setPhoneNumber,
    phonePrefixes,
    showDropdown,
    setShowDropdown,
    statusDocumentList,
    setStatusDocumentList,
    addressDocumentList,
    setAddressDocumentList,
    bankDocumentList,
    setBankDocumentList,
    closeCallback,
    phoneNumber,
    canUpload,
    uploadDocuments,
  } = useMyProfile();
  const statuses = useSelector((state: State) => state.userStore.statuses);
  const address_status = useSelector((state: State) => state.userStore.address_status);
  const bank_account_status = useSelector((state: State) => state.userStore.bank_account_status);
  const identity_status = useSelector((state: State) => state.userStore.identity_status);
  const legalStatus = useSelector((state: State) => state.userStore.legalStatus);

  const addressTooltip =
    legalStatus === 1 ? [i18n.t("profile.myProfile.tooltip.personal.address")] : [i18n.t("profile.myProfile.tooltip.company.address")];
  const identityTooltip =
    legalStatus === 1
      ? [i18n.t("profile.myProfile.tooltip.personal.identity")]
      : [
          i18n.t("profile.myProfile.tooltip.company.identity.one"),
          i18n.t("profile.myProfile.tooltip.company.identity.two"),
          i18n.t("profile.myProfile.tooltip.company.identity.three"),
        ];
  const bankTooltip = legalStatus === 1 ? [i18n.t("profile.myProfile.tooltip.personal.bank")] : [i18n.t("profile.myProfile.tooltip.company.bank")];

  return (
    <>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => navigation.navigate("SideMenuScreen"),
        }}
        middle={{
          type: "text",
          title: "profile.myProfile.title",
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.navigate("ContactNavigator");
          },
        }}
        mb={24}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 42 }}>
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          <UpdateInformation onPress={() => navigation.navigate("MessagesScreen")}>
            <Image source={toDoIcon} style={{ marginRight: 8, height: 20, width: 20 }} resizeMode="contain" />
            <View style={{ flex: 1 }}>
              <Text>
                <GoldBrokerText i18nKey="profile.myProfile.instruction" flex left sspL color={colors.text.blue} fontSize={16} />
                <GoldBrokerText i18nKey="profile.myProfile.underlined_instruction" flex underline left sspL color={colors.text.blue} fontSize={16} />
              </Text>
            </View>
          </UpdateInformation>
          <ProfileBlock>
            <View style={styles.title}>
              <GoldBrokerText i18nKey="profile.myProfile.sections.identity" color={titleColors[identity_status || 3].color} ls sspL />
              <Image source={titleColors[identity_status || 3].icon} style={{ marginRight: 8, height: 14, width: 14 }} resizeMode="contain" />
            </View>
            <View style={{ alignItems: "flex-start", marginVertical: 8 }}>
              <GoldBrokerText value={statuses.find((status) => status.value === identity_status)?.label || ""} sspL fontSize={16} />
              {canUpload(identity_status) ? (
                <>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => setShowDropdown(true)}>
                      <View style={styles.countryCode}>
                        <Image source={CountryFlags[countryCode]} style={{ borderRadius: 20, marginRight: 8 }} />
                        <Text
                          style={{
                            fontSize: 18,
                            fontFamily: "SSPRegular",
                            marginRight: 8,
                          }}
                        >
                          {phonePrefixes[countryCode]}
                        </Text>
                        <Icon name="triangle-down" />
                      </View>
                      <CountryPicker isVisible={showDropdown} closeCallback={closeCallback} phonePrefixes={phonePrefixes} />
                    </TouchableOpacity>
                    <FormInput placeholder={i18n.t("contactUs.form.inputs.phone")} onChangeText={setPhoneNumber} value={phoneNumber} />
                  </View>
                  <AttachmentComponent documentList={statusDocumentList} setDocumentList={setStatusDocumentList} tooltip={identityTooltip} />
                </>
              ) : null}
            </View>
          </ProfileBlock>
          <ProfileBlock>
            <View style={styles.title}>
              <GoldBrokerText i18nKey="profile.myProfile.sections.address" ls color={titleColors[address_status || 3].color} sspL />
              <Image source={titleColors[address_status || 3].icon} style={{ marginRight: 8, height: 14, width: 14 }} resizeMode="contain" />
            </View>
            <View style={{ alignItems: "flex-start", marginVertical: 8 }}>
              <GoldBrokerText value={statuses.find((status) => status.value === address_status)?.label || ""} sspL fontSize={16} />
              {canUpload(address_status) ? (
                <AttachmentComponent documentList={addressDocumentList} setDocumentList={setAddressDocumentList} tooltip={addressTooltip} />
              ) : null}
            </View>
          </ProfileBlock>
          <ProfileBlock>
            <View style={styles.title}>
              <GoldBrokerText i18nKey="profile.myProfile.sections.bank_account" ls color={titleColors[bank_account_status || 3].color} sspL />
              <Image source={titleColors[bank_account_status || 3].icon} style={{ marginRight: 8, height: 14, width: 14 }} resizeMode="contain" />
            </View>
            <View style={{ alignItems: "flex-start", marginVertical: 8 }}>
              <GoldBrokerText value={statuses.find((status) => status.value === bank_account_status)?.label || ""} sspL fontSize={16} />
              {canUpload(bank_account_status) ? (
                <AttachmentComponent documentList={bankDocumentList} setDocumentList={setBankDocumentList} maxDocument={1} tooltip={bankTooltip} />
              ) : null}
            </View>
          </ProfileBlock>
        </View>
        {canUpload(address_status) || canUpload(bank_account_status) || canUpload(identity_status) ? (
          <LightButton large ph={60} i18nKey="profile.myProfile.validateButton" onPress={uploadDocuments} />
        ) : null}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    flexDirection: "row",
    paddingBottom: 8,
    justifyContent: "space-between",
    borderBottomColor: colors.text.gray,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light,
    padding: 16,
    borderRadius: 4,
    marginRight: 12,
  },
});
