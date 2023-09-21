import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { State } from "../../../store/configure.store";
import colors from "../../../themes/colors.theme";
import { formatCurrency } from "../../../utils/currencies.utils";
import { convertTZ } from "../../../utils/date.utils";
import { GoldBrokerText } from "../../style/goldbroker-text.component";
import { Performance } from "../../style/performance.component";

export default function StockProductCard({ stockProduct }) {
  const product = stockProduct._embedded.product;
  const { warehouse } = stockProduct;

  const timezone = useSelector((state: State) => state.appStore.timezone);
  const locale = useSelector((state: State) => state.appStore.locale);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 23,
          marginBottom: 24,
        }}
      >
        <View>
          <Image source={{ uri: product.picture }} style={{ width: 72, height: 72, resizeMode: "contain" }} />
        </View>
        <View
          style={{
            flex: 1,
            marginLeft: 16,
          }}
        >
          <GoldBrokerText left value={product.name} ssp fontSize={16} mb={8} />
          <GoldBrokerText left value={product.brand} ssp color={colors.gold} mb={4} fontSize={16} />
          <Text>
            <GoldBrokerText left value={`${stockProduct.ounces} `} sspL fontSize={14} color={colors.text.lightGray} />
            <GoldBrokerText
              i18nKey="profile.coin_and_bar.product_detail.once"
              sspL
              fontSize={14}
              color={colors.text.lightGray}
            />
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 36,
          marginBottom: 24,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, paddingRight: 16 }}>
          <GoldBrokerText
            left
            i18nKey="profile.coin_and_bar.product_detail.product.warehouse"
            ls
            fontSize={12}
            sspL
            color={colors.transparent5}
            mb={6}
          />
          <GoldBrokerText left value={warehouse.fullname} ssp fontSize={16} />
          {/* <GoldBrokerText left value={warehouse.city} fontSize={14} sspL color={colors.text.lightGray} /> */}
        </View>
        <View style={{ flex: 1 }}>
          <GoldBrokerText
            left
            i18nKey="profile.coin_and_bar.product_detail.product.purchasePrice"
            ls
            fontSize={12}
            sspL
            color={colors.transparent5}
            mb={6}
          />
          <GoldBrokerText
            left
            value={formatCurrency(
              stockProduct.order_price.converted.currency,
              stockProduct.order_price.converted.amount
            )}
            ssp
            fontSize={16}
            mb={4}
          />
          <GoldBrokerText
            left
            value={convertTZ(stockProduct.purchase_date, timezone, locale)}
            fontSize={14}
            sspL
            color={colors.text.lightGray}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 36,
          marginBottom: 40,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 }}>
          <GoldBrokerText
            left
            i18nKey="profile.coin_and_bar.product_detail.product.purchaseValue"
            ls
            fontSize={12}
            sspL
            color={colors.transparent5}
            mb={6}
          />
          <GoldBrokerText
            left
            value={formatCurrency(stockProduct.value.converted.currency, stockProduct.value.converted.purchase)}
            ssp
            fontSize={16}
            mb={4}
          />
          <GoldBrokerText
            left
            value={`${formatCurrency(
              stockProduct.spot_price.converted.currency,
              stockProduct.spot_price.converted.purchase
            )} /once`}
            fontSize={14}
            sspL
            color={colors.text.lightGray}
          />
        </View>
        <View style={{ flex: 1 }}>
          <GoldBrokerText
            left
            i18nKey="profile.coin_and_bar.product_detail.product.currentValue"
            ls
            fontSize={12}
            sspL
            color={colors.transparent5}
            mb={6}
          />
          <GoldBrokerText
            left
            value={formatCurrency(stockProduct.value.converted.currency, stockProduct.value.converted.current)}
            ssp
            fontSize={16}
            mb={4}
          />
          <GoldBrokerText
            left
            value={`${formatCurrency(
              stockProduct.spot_price.converted.currency,
              stockProduct.spot_price.converted.current
            )} /once`}
            fontSize={14}
            sspL
            color={colors.text.lightGray}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GoldBrokerText
          i18nKey="profile.coin_and_bar.product_detail.product.performance"
          sspL
          fontSize={12}
          color={colors.transparent5}
          ls
          mr={18}
        />
        <Performance performance={stockProduct.value.converted.performance} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightDark,
    marginBottom: 12,
    borderBottomColor: colors.gold,
    borderBottomWidth: 3,
    paddingVertical: 24,
  },
});
