import React, { useEffect, useState } from "react";
import { Image, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import { CountryFlags } from "../../constants/country-names.constant";
import { getPhones } from "../../services/static/config.service";
import { GoldBrokerText } from "../style/goldbroker-text.component";

const letterIcon = require(`../../../assets/icons/more/icons-letter.png`);
const phoneIcon = require(`../../../assets/icons/more/icons-tel-phone.png`);

export const ContactInformation = () => {
  const [phones, setPhones] = useState<any>([]);

  useEffect(() => {
    getPhones().then((r) => setPhones(r.phones));
  }, []);

  return (
    <View style={{ marginHorizontal: 16, marginBottom: 42, marginTop: 16 }}>
      <View style={styles.block}>
        <Image source={phoneIcon} style={{ width: 24, height: 24 }} />
        <View>
          {phones.map((phone, index) => (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${phone.phone_number}`);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 24,
              }}
              key={index}
            >
              <Image
                source={CountryFlags[phone.country_code]}
                style={{
                  width: 15,
                  height: 15,
                  marginRight: 12,
                  borderRadius: 12,
                }}
              />
              <GoldBrokerText left fontSize={18} ssp value={phone.phone_number} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.block}>
        <Image source={letterIcon} style={{ width: 24, height: 24 }} />
        <View style={{ alignItems: "flex-start", marginLeft: 24 }}>
          <GoldBrokerText left fontSize={17} ssp value="GOLDBROKER LTD" />
          <GoldBrokerText left fontSize={17} ssp value="25 Eccleston Place," />
          <GoldBrokerText left fontSize={17} ssp value="London, SW1W 9NF" />
          <GoldBrokerText left fontSize={17} ssp value="United Kingdom" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    flexDirection: "row",
    backgroundColor: "#121212",
    marginBottom: 8,
    padding: 24,
  },
});
