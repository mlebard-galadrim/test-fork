import { Image, StyleSheet, Switch, TouchableOpacity, View } from "react-native";
import { State, Store } from "../../store/configure.store";

import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useSelector } from "react-redux";
import RegisterSlice from "../../store/slices/register.slice";
import colors from "../../themes/colors.theme";
import { GoldBrokerText } from "../style/goldbroker-text.component";

const newsletterIcon = require("../../../assets/icons/register/icons-newsletter.png");
const nextStepActive = require("../../../assets/icons/register/icons-actions-step-suivant.png");

export const NewsletterStep = () => {
  const navigation = useNavigation();
  const metalsNewsletter = useSelector((state: State) => state.registerStore.metalNewsletter);
  const subscribedToInAppNewsletter = useSelector((state: State) => state.registerStore.subscribedToInAppNewsletter);

  const onSubmit = () => {
    navigation.navigate("RegisterPinScreen");
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Image source={newsletterIcon} style={{ width: 32, height: 32, marginBottom: 24 }} />
        <GoldBrokerText i18nKey="register.newsletter.instruction" ssp mb={16} fontSize={17} />
        <View style={styles.newsletterBox}>
          <GoldBrokerText flex left fontSize={16} mh={8} sspM i18nKey="register.newsletter.setting1" />
          <Switch
            value={metalsNewsletter}
            trackColor={{ false: colors.inactiveText, true: colors.gold }}
            thumbColor={colors.white}
            onValueChange={() => {
              Store.dispatch(RegisterSlice.actions.setMetalNewsletter(!metalsNewsletter));
            }}
          />
        </View>
        <View style={styles.newsletterBox}>
          <GoldBrokerText flex left fontSize={16} mh={8} sspM i18nKey="register.newsletter.setting3" />
          <Switch
            value={subscribedToInAppNewsletter}
            trackColor={{ false: colors.inactiveText, true: colors.gold }}
            thumbColor={colors.white}
            onValueChange={() => {
              Store.dispatch(RegisterSlice.actions.setSubscribedToInAppNewsletter(!subscribedToInAppNewsletter));
            }}
          />
        </View>
      </View>
      <TouchableOpacity onPress={onSubmit}>
        {!metalsNewsletter ? (
          <GoldBrokerText fontSize={17} mb={83} i18nKey="register.newsletter.skip" sspM />
        ) : (
          <Image
            source={nextStepActive}
            style={{
              width: 62,
              height: 62,
              marginRight: 16,
              borderRadius: 30,
              alignSelf: "flex-end",
            }}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  newsletterBox: {
    marginHorizontal: 16,
    paddingRight: 8,
    marginBottom: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.transparent3,
    borderRadius: 4,
    alignItems: "center",
    paddingVertical: 16,
  },
});
