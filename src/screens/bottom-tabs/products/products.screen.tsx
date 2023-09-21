import { useNavigation } from "@react-navigation/native";
import i18n from "i18n-js";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Searchbar } from "../../../components/generic/searchbar/searchbar.component";
import { TitleTextBlock } from "../../../components/generic/title-text.component";
import { Title } from "../../../components/generic/title.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { ProductCard } from "../../../components/products/product-card.component";
import { metalConvert, productTypeConvert } from "../../../constants/product-filter.constant";
import { State, Store } from "../../../store/configure.store";
import ProductFilterSlice from "../../../store/slices/product-filter.slice";
import { loadProducts } from "../../../utils/data.utils";

const Container = styled(View)`
  height: 100%;
  display: flex;
`;

export default function ProductsScreen() {
  const navigation = useNavigation();
  const products = useSelector((state: State) => state.dataStore.products);
  const locale = useSelector((state: State) => state.appStore.locale);
  const currency = useSelector((state: State) => state.preferencesStore.currency);
  const [search, setSearch] = useState("");
  const activeFilters = useSelector((state: State) => state.productFilterStore);
  const [filterProduct, setFilterProduct] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const decreaseSort = (p1, p2) => {
    return parseFloat(p1.as_low_as) < parseFloat(p2.as_low_as) ? 1 : -1;
  };

  const increaseSort = (p1, p2) => {
    return parseFloat(p1.as_low_as) > parseFloat(p2.as_low_as) ? 1 : -1;
  };

  const isActive = (activeFilters) => {
    return activeFilters.price != null || activeFilters.metal.length != 0 || activeFilters.product.length != 0;
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProducts(currency);
    setRefreshing(false);
  };

  useEffect(() => {
    loadProducts(currency).then(() => {
      Store.dispatch(ProductFilterSlice.actions.setShouldReload(true));
    });
  }, [currency]);

  useEffect(() => {
    loadProducts(currency).then(() => {
      Store.dispatch(ProductFilterSlice.actions.setShouldReload(true));
    });
  }, [locale]);

  useEffect(() => {
    setFilterProduct(
      products.filter((p) => {
        return p.name.toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [search]);

  useEffect(() => {
    if (activeFilters.shouldReload) {
      let temp = products.filter((p) => {
        return (
          (activeFilters.metal.includes(i18n.t(metalConvert[p.metal.type])) || activeFilters.metal.length === 0) &&
          (activeFilters.product.includes(i18n.t(productTypeConvert[p.type])) || activeFilters.product.length === 0)
        );
      });
      if (activeFilters.price !== null) {
        temp = temp.sort(activeFilters.price === i18n.t("products.filters.byPrice.categories.increasing") ? increaseSort : decreaseSort);
      }
      setFilterProduct(temp);
      Store.dispatch(ProductFilterSlice.actions.setShouldReload(false));
    }
  }, [activeFilters.shouldReload]);

  return (
    <Container>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "three-bars",
          function: () => {
            navigation.navigate("MenuNavigator");
          },
        }}
        mb={17}
      />
      <Title title="products.title" />
      <Searchbar active={isActive(activeFilters)} setSearch={setSearch} search={search} filterScreen={"ProductFilterScreen"} />
      <ScrollView
        style={{ marginTop: 16 }}
        contentContainerStyle={styles.productList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={"white"} />}
      >
        {filterProduct.length > 0 ? (
          filterProduct.map((item, key) => {
            return (
              <ProductCard
                title={item.name}
                price={item.as_low_as}
                picture={item.picture}
                key={key}
                product={item}
                year={item.year}
                metal={item.metal.type}
                mb={4}
              />
            );
          })
        ) : (
          <View style={{ marginTop: "20%" }}>
            <TitleTextBlock i18nKeyTitle="products.emptySearch.title" i18nKeyBody="products.emptySearch.body" />
          </View>
        )}
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  productList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 16,
    justifyContent: "space-between",
  },
});
