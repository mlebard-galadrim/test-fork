import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { CheckBox } from "../../../components/generic/checkbox.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { GoldBrokerText } from "../../../components/style/goldbroker-text.component";
import { useUserPreferences } from "../../../hooks/useUserPreferences";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { loadPublications } from "../../../utils/data.utils";

const LanguageItem = (props) => {
  return (
    <View style={styles.item}>
      <GoldBrokerText ssp fontSize={18} value={props.language} />
      <CheckBox round checked={props.checked} />
    </View>
  );
};

export const LanguageScreen = () => {
  const navigation = useNavigation();
  const locales = useSelector((state: State) => state.dataStore.locales);
  const [locale, setLocale] = useState(null);
  const { locale: localeCode, handleLocaleChange } = useUserPreferences();

  const onLocaleChange = async (localeCode) => {
    handleLocaleChange(localeCode);
    await loadPublications([], [], 1, 10);
    navigation.navigate("HomeScreen");
  };

  useEffect(() => {
    setLocale(locales.filter((l) => l.code === localeCode)[0]);
  }, [localeCode]);

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            navigation.goBack();
          },
        }}
        middle={{
          type: "text",
          title: "leftMenu.submenus.settings.menus.language.title",
        }}
      />
      <View style={{ flex: 1, marginHorizontal: 14 }}>
        {locales.map((item, key) => {
          return (
            <TouchableOpacity
              onPress={() => {
                onLocaleChange(item.code);
              }}
              key={key}
            >
              <LanguageItem language={item.original_name} checked={locale && locale.original_name === item.original_name} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.gray,
    padding: 10,
    marginBottom: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },
});
