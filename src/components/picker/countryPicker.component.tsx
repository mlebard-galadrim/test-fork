import React, { useEffect, useState } from "react";
import { FlatList, Image, Modal, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import { useSelector } from "react-redux";
import { CountryFlags, CountryNames } from "../../constants/country-names.constant";
import { getCountries } from "../../services/static/countries.service";
import { State } from "../../store/configure.store";
import colors from "../../themes/colors.theme";
import { GoldBrokerText } from "../style/goldbroker-text.component";

const supportedLocales = ["en", "fr", "de"];

export const CountryPicker = (props) => {
  const [countries, setCountries] = useState([]);
  const locale = useSelector((state: State) => state.appStore.locale);
  useEffect(() => {
    getCountries().then((r) => {
      setCountries(Object.keys(r._embedded.items));
    });
  }, []);

  const renderItemView = (item, index) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 4,
        }}
        key={index}
        onPress={() => {
          props.closeCallback(item);
        }}
      >
        <Image source={CountryFlags[item]} style={{ width: 15, height: 15, marginRight: 12 }} />
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
            <GoldBrokerText black left fontSize={17} ssp value={CountryNames[supportedLocales.includes(locale) ? locale : "en"][item]} />
          </View>
          <GoldBrokerText black fontSize={17} ssp value={props.phonePrefixes[item]} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={props.isVisible}
      transparent
      animationType={"fade"}
      onRequestClose={() => {
        props.closeCallback();
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.transparent3,
        }}
      >
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 20,
            padding: 15,
            height: "60%",
            width: "80%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginBottom: 12,
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 12,
            }}
          >
            <GoldBrokerText ssp black fontSize={17} i18nKey={"contactUs.form.country_picker_title"} />
            <TouchableOpacity
              onPress={() => {
                props.closeCallback();
              }}
            >
              <Icon name="x" size={30} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={countries.filter((p) => props.phonePrefixes[p])}
            renderItem={({ item, index }) => renderItemView(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    </Modal>
  );
};
