import React from "react";
import { Image, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { GoldBrokerText } from "../../style/goldbroker-text.component";

const infoIcon = require("../../../../assets/icons/profile/icons-espace-client-info.png");
export default function InformationComponent() {
  const userId = useSelector((state: State) => state.userStore.userId);
  return (
    <View style={{ marginTop: 24 }}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "rgba(118, 189, 255, 0.16)",
          marginHorizontal: 16,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Image
          source={infoIcon}
          style={{
            width: 20,
            height: 20,
            resizeMode: "contain",
            marginRight: 16,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text>
            <GoldBrokerText
              color={colors.text.blue}
              i18nKey="profile.fund_transfer.informations.body11"
              sspL
              fontSize={16}
              left
              mb={16}
            />
            <GoldBrokerText color={colors.text.blue} value={` #${userId} `} sspL fontSize={16} left mb={16} />
            <GoldBrokerText
              color={colors.text.blue}
              i18nKey="profile.fund_transfer.informations.body12"
              sspL
              fontSize={16}
              left
              mb={16}
            />
          </Text>
          <GoldBrokerText
            color={colors.text.blue}
            i18nKey="profile.fund_transfer.informations.body2"
            sspL
            fontSize={16}
            mb={16}
            left
          />
          <GoldBrokerText
            color={colors.text.blue}
            i18nKey="profile.fund_transfer.informations.body3"
            sspL
            fontSize={16}
            left
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: colors.lightDark,
          marginHorizontal: 16,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <Image
          source={infoIcon}
          style={{
            width: 20,
            height: 20,
            resizeMode: "contain",
            marginRight: 16,
            tintColor: colors.silver,
          }}
        />
        <View style={{ flex: 1 }}>
          <GoldBrokerText
            colors={colors.silver}
            i18nKey="profile.fund_transfer.informations2.title"
            sspL
            fontSize={16}
            left
            mb={16}
          />
          <GoldBrokerText
            colors={colors.silver}
            i18nKey="profile.fund_transfer.informations2.body"
            sspL
            fontSize={16}
            mb={16}
            left
          />
        </View>
      </View>
    </View>
  );
}
