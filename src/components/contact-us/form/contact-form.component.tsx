import i18n from "i18n-js";
import React, { useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import styled from "styled-components";
import { CountryFlags } from "../../../constants/country-names.constant";
import { getPhonePrefixesCollection } from "../../../services/static/phone-prefixes.service";
import colors from "../../../themes/colors.theme";
import { LightButton } from "../../generic/buttons/light-button.component";
import { CountryPicker } from "../../picker/countryPicker.component";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { useForm } from "./useForm";

export const FormInput = styled(TextInput)`
  flex: ${(props) => (props.unflex ? 0 : 1)};
  background-color: ${colors.light};
  padding: 16px;
  border-radius: 4px;
  margin-right: ${(props) => (props.mr ? "12px" : "0px")};
  font-size: 18px;
  font-family: "SSPRegular";
  margin-bottom: 12px;
  height: ${(props) => (props.textbox ? "165px" : "auto")};
`;

export const ContactForm = ({ setSuccess }) => {
  const {
    showDropdown,
    setShowDropdown,
    countryCode,
    phonePrefixes,
    setPhonePrefixes,
    firstname,
    setFirstname,
    lastname,
    setLastname,
    phoneNumber,
    setPhoneNumber,
    mail,
    setMail,
    subject,
    setSubject,
    body,
    setBody,
    closeCallback,
    submitContact,
  } = useForm(setSuccess);

  useEffect(() => {
    getPhonePrefixesCollection().then((r) => {
      setPhonePrefixes(r._embedded.items);
    });
  }, []);

  return (
    <View>
      <ScrollView style={{ marginHorizontal: 38 }}>
        <GoldBrokerText fontSize={32} mb={32} i18nKey="contactUs.form.title" />
        <View style={{ flexDirection: "row" }}>
          <FormInput mr onChangeText={setFirstname} value={firstname} placeholder={i18n.t("contactUs.form.inputs.firstname")} />
          <FormInput placeholder={i18n.t("contactUs.form.inputs.lastname")} onChangeText={setLastname} value={lastname} />
        </View>
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
        <FormInput placeholder={i18n.t("contactUs.form.inputs.mail")} onChangeText={setMail} value={mail} />
        <FormInput placeholder={i18n.t("contactUs.form.inputs.subject")} onChangeText={setSubject} value={subject} />
        <FormInput
          style={{ textAlignVertical: "top" }}
          textbox
          onChangeText={setBody}
          value={body}
          placeholder={i18n.t("contactUs.form.inputs.message")}
          multiline={true}
        />
      </ScrollView>
      <LightButton large fontSize={20} mh={82} mb={50} i18nKey="contactUs.form.sendButton" onPress={submitContact} />
    </View>
  );
};

const styles = StyleSheet.create({
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light,
    padding: 16,
    borderRadius: 4,
    marginRight: 12,
  },
});
