import i18n from "i18n-js";
import React, { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { LightButton } from "../../../components/generic/buttons/light-button.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { SectionProduct } from "../../../components/home/section/section-products.component";
import { ProductPresentation } from "../../../components/products/presentation.component";
import { TabBlock } from "../../../components/products/tab.component";
import { useLogin } from "../../../hooks/useLogin";
import colors from "../../../themes/colors.theme";

export default function ProductScreen({ navigation, route }) {
  const product = route.params.product;
  const pictureUrl = { uri: product.picture };
  const scrollRef = useRef(null);
  const { logged } = useLogin();
  const goToTop = () => {
    scrollRef.current.scrollTo({ y: 0, animated: true });
  };

  const message = {
    subject: i18n.t("products.interested.message.subject"),
    body:
      i18n.t("products.interested.message.body") +
      `« ${product.name} » (${product.url}).` +
      i18n.t("products.interested.message.body2"),
  };

  return (
    <>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            navigation.goBack();
          },
        }}
        right={{
          type: "buttonText",
          title: "contactUs.topbar_button_text",
          function: () => {
            navigation.push("ContactNavigator");
          },
        }}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} ref={scrollRef}>
        <ProductPresentation
          name={product.name}
          price={product.as_low_as}
          pictureUrl={pictureUrl}
          videos={product.videos}
          storage={product.storage.countries}
          delivery={product.delivery.countries}
          pictures={product.pictures}
          available={product.available}
        />
        <TabBlock product={product} />
        <SectionProduct i18nKey="products.similarProducts" goToTop={goToTop} currentProduct={product} />
      </ScrollView>
      <View style={styles.footer}>
        <LightButton
          mb={16}
          ph={50}
          fontSize={20}
          i18nKey="products.interested.title"
          i18nKeySubtitle="products.interested.subtitle"
          onPress={() => {
            if (logged) {
              navigation.navigate("NewMessageScreen", {
                message,
              });
            } else {
              navigation.navigate("LoginScreen");
            }
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 90,
    paddingTop: 22,
  },
  footer: {
    backgroundColor: colors.dark,
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
  },
});
