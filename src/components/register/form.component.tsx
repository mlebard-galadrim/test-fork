import { useNavigation } from "@react-navigation/native";
import i18n from "i18n-js";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { State, Store } from "../../store/configure.store";
import RegisterSlice from "../../store/slices/register.slice";
import colors from "../../themes/colors.theme";
import { checkPassword, validateEmail } from "../../utils/regex.util";
import { NextStepButton } from "../generic/buttons/next-step-button.component";
import { CheckBox } from "../generic/checkbox.component";
import { GoldbrokerInput } from "../style/goldbroker-input.component";
import { GoldBrokerText } from "../style/goldbroker-text.component";
import { UseRegisterForm } from "./useRegisterForm";

const useIcon = require("../../../assets/icons/register/icons-user.png");

const Item = (props) => {
  return (
    <TouchableOpacity style={styles.item} onPress={props.onPress}>
      <CheckBox round checked={props.checked} />
      <GoldBrokerText ml={12} ssp i18nKey={props.i18nKey} fontSize={17} />
    </TouchableOpacity>
  );
};

export const FormStep = (props) => {
  const { mail, firstname, lastname, legalStatus, companyName, password, secondPassword, tosRead, error } = useSelector(
    (state: State) => state.registerStore,
  );
  const [showPasswordIndication, setShowPasswordIndication] = useState(false);
  const {
    stepCompleted,
    setStepCompleted,
    onMailChange,
    onCompanyNameChange,
    onFirstnameChange,
    onLastNameChange,
    onPasswordChange,
    onTosSwitched,
    onSecondPasswordChange,
  } = UseRegisterForm();
  const navigation = useNavigation();

  useEffect(() => {
    setStepCompleted(
      validateEmail(mail) && checkPassword(password) && firstname.length !== 0 && lastname.length !== 0 && secondPassword === password && tosRead,
    );
  }, [mail, password, firstname, lastname, tosRead, secondPassword]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          alignItems: "center",
          marginHorizontal: 50,
        }}
      >
        <Image source={useIcon} style={{ width: 32, height: 32, marginBottom: 24 }} />
        <GoldBrokerText i18nKey="register.form.instruction" ssp mb={16} fontSize={17} />
      </View>
      <View
        style={{
          flex: 1,
          marginHorizontal: 37,
          marginTop: 30,
        }}
      >
        <View style={styles.checkboxRow}>
          <Item
            i18nKey="register.form.legalStatus.individual"
            checked={legalStatus === 1}
            onPress={() => Store.dispatch(RegisterSlice.actions.setLegalstatus(1))}
          />
          <Item
            i18nKey="register.form.legalStatus.company"
            checked={legalStatus === 2}
            onPress={() => Store.dispatch(RegisterSlice.actions.setLegalstatus(2))}
          />
        </View>
        {legalStatus === 2 ? (
          <View style={{ marginVertical: 6 }}>
            <GoldbrokerInput
              value={companyName}
              padding={0}
              radius={4}
              placeholder={i18n.t("register.form.company")}
              onChange={onCompanyNameChange}
            />
          </View>
        ) : null}
        <View style={{ marginVertical: 6, flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <GoldbrokerInput value={firstname} padding={0} radius={4} placeholder={i18n.t("register.form.firstname")} onChange={onFirstnameChange} />
          </View>
          <View style={{ flex: 1 }}>
            <GoldbrokerInput value={lastname} padding={0} radius={4} placeholder={i18n.t("register.form.lastname")} onChange={onLastNameChange} />
          </View>
        </View>
        <View style={{ marginVertical: 6 }}>
          <GoldbrokerInput value={mail} padding={0} radius={4} placeholder={i18n.t("register.form.mail.placeholder")} onChange={onMailChange} />
          {error.email?.errors && <GoldBrokerText left ssp fontSize={12} color={colors.danger} value={error.email.errors[0]} />}
        </View>
        <View
          style={{
            marginVertical: 6,
          }}
        >
          <GoldbrokerInput
            value={password}
            secret={true}
            padding={0}
            radius={4}
            placeholder={i18n.t("register.form.password.placeholder")}
            onFocus={() => setShowPasswordIndication(true)}
            onBlur={() => setShowPasswordIndication(false)}
            onChange={onPasswordChange}
          />
          {showPasswordIndication ? (
            <View style={{ position: "absolute", top: -42, backgroundColor: colors.darkBlue, borderRadius: 4, padding: 5 }}>
              <GoldBrokerText left fontSize={12} ssp color={colors.white} i18nKey="register.form.password.rules" />
            </View>
          ) : null}
          {error.password?.children?.first?.errors && (
            <GoldBrokerText left ssp fontSize={12} color={colors.danger} value={error.password.children.first.errors[0]} />
          )}
        </View>
        <View style={{ marginVertical: 6 }}>
          <GoldbrokerInput
            value={secondPassword}
            secret={true}
            padding={0}
            radius={4}
            placeholder={i18n.t("register.form.password.confirmPlaceholder")}
            onChange={onSecondPasswordChange}
          />
        </View>
        <View style={{ marginTop: 12, flexDirection: "row", alignItems: "flex-start" }}>
          <Switch
            value={tosRead}
            trackColor={{ false: colors.inactiveText, true: colors.gold }}
            thumbColor={colors.white}
            onValueChange={onTosSwitched}
          />
          <View style={{ marginLeft: 8, flex: 1 }}>
            <Text>
              <GoldBrokerText i18nKey="register.form.cguSwitch" ssp left color={colors.white} fontSize={14} />
              <Text onPress={() => navigation.navigate("RegisterTosScreen")}>
                <GoldBrokerText i18nKey="register.form.termsAndConditions" ssp left color={colors.gold} fontSize={14} />
              </Text>
              <GoldBrokerText i18nKey="register.form.cguSwitch2" ssp left color={colors.white} fontSize={14} />
              <Text onPress={() => navigation.navigate("CguScreen")}>
                <GoldBrokerText i18nKey="register.form.privacyPolicy" ssp left color={colors.gold} fontSize={14} />
              </Text>
            </Text>
          </View>
        </View>
        {error.acceptTermsAndConditions?.errors && (
          <GoldBrokerText left ssp fontSize={12} color={colors.danger} value={error.acceptTermsAndConditions?.errors[0]} />
        )}
      </View>
      <View style={{ flexDirection: "row", marginLeft: 37 }}>
        <NextStepButton
          active={stepCompleted}
          onPress={() => {
            navigation.navigate("RegisterNotificationScreen");
          }}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  checkboxRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    marginBottom: 34,
  },
  item: {
    marginRight: "auto",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
