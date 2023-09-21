import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { deviceWidth } from "../../constants/device.constant";
import { State } from "../../store/configure.store";
import colors from "../../themes/colors.theme";
import { formatCurrency } from "../../utils/currencies.utils";
import { GoldBrokerText } from "../style/goldbroker-text.component";
import { NewProduct } from "./new-product.component";

const productCardWidth = Math.round((deviceWidth - 36) / 2); // 2*16 (2 margins) + 4 (middle space)

export const ProductCard = (props) => {
  let pictureUrl = { uri: props.picture };
  const navigation = useNavigation();
  const product = props.product;
  const currency = useSelector((state: State) => state.preferencesStore.currency);

  const goToProduct = () => {
    navigation.navigate("ProductScreen", { product });
    Boolean(props.goToTop) && props.goToTop();
  };
  return (
    <TouchableOpacity style={styles(props).container} onPress={goToProduct}>
      {product.ribbon === "new" && <NewProduct />}
      <Image
        style={{
          width: 114,
          height: 120,
          resizeMode: "contain",
        }}
        source={pictureUrl}
      />
      <View>
        <GoldBrokerText black left height={55} fontSize={17} mt={32} mb={5} value={props.title} nblines={2} />
        <GoldBrokerText
          black
          left
          fontSize={21}
          sspB
          mb={15}
          value={formatCurrency(currency, props.price)}
          nblines={1}
        />
      </View>
    </TouchableOpacity>
  );
};

const getMetalColor = (metal) => {
  switch (metal) {
    case "XAU":
      return colors.gold;
    case "XAG":
      return colors.silver;
    case "XPT":
      return colors.platine;
    case "XPD":
      return colors.palladium;
    default:
      return colors.dark;
  }
};

const styles = (props) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      width: props.width ?? productCardWidth,
      marginRight: props.width ? 16 : undefined,
      borderRadius: 4,
      alignItems: "center",
      paddingTop: 45,
      marginBottom: props.mb ?? 0,
      paddingHorizontal: 16,
      borderBottomWidth: 4,
      borderBottomColor: getMetalColor(props.metal),
    },
  });
