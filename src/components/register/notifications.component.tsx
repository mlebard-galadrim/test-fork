import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { NotificationsBlock } from "../generic/notifications/notifications-block.components";
import { GoldBrokerText } from "../style/goldbroker-text.component";

const notificationIcon = require("../../../assets/icons/register/icons-bell.png");
const nextStepActive = require("../../../assets/icons/register/icons-actions-step-suivant.png");

export const NotificationStep = () => {
  const navigation = useNavigation();
  const onSubmit = () => {
    navigation.navigate("RegisterNewsletterScreen");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Image source={notificationIcon} style={{ width: 32, height: 32, marginBottom: 24 }} />
        <GoldBrokerText i18nKey="register.notifications.instruction" ssp mb={16} fontSize={17} />
        <NotificationsBlock register={true} />
      </View>
      <TouchableOpacity onPress={onSubmit}>
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
});
