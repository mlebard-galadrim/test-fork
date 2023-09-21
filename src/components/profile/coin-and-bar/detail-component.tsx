import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Octicons";
import colors from "../../../themes/colors.theme";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import StockProductCard from "./stock-product-card";

export default function DetailComponent({ stockProducts }) {
  const [displayedProducts, setDisplayedProducts] = useState<any>([]);

  useEffect(() => {
    if (stockProducts.length < 4) {
      setDisplayedProducts(stockProducts);
    } else {
      setDisplayedProducts(stockProducts.slice(0, 3));
    }
  }, [stockProducts]);
  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      {/* <GoldBrokerText
        left
        fontSize={27}
        i18nKey="profile.coin_and_bar.product_detail.title"
        mb={12}
      /> */}
      {displayedProducts.map((stockProduct, key) => (
        <StockProductCard key={key} stockProduct={stockProduct} />
      ))}
      {displayedProducts.length < stockProducts.length && (
        <TouchableOpacity style={styles().seeMoreProduct} onPress={() => setDisplayedProducts(stockProducts)}>
          <GoldBrokerText
            i18nKey="profile.coin_and_bar.product_detail.seemore"
            color={colors.gold}
            fontSize={18}
            ssp
            mr={13}
          />
          <Icon name="chevron-down" size={18} color={colors.gold} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = (active?) =>
  StyleSheet.create({
    metalSelectionBar: {
      marginBottom: 16,
      flexDirection: "row",
      backgroundColor: colors.lightDark,
      alignItems: "center",
      borderRadius: 4,
    },
    metalButton: {
      flex: 1,
      paddingVertical: 10,
      margin: 3,
      backgroundColor: active ? colors.gold : undefined,
      borderRadius: 4,
    },
    seeMoreProduct: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 20,
      marginBottom: 40,
    },
  });
