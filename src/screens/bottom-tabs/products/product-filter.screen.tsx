import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { ProductsFilterBlock } from "../../../components/filter/products/product-filter.component";
import { TopBar } from "../../../components/generic/top-bar.component";
import { productFilter } from "../../../constants/product-filter.constant";
import { State, Store } from "../../../store/configure.store";
import ProductFilterSlice from "../../../store/slices/product-filter.slice";
import { loadProducts } from "../../../utils/data.utils";

export const ProductFilterScreen = () => {
  const navigation = useNavigation();
  const currency = useSelector(
    (state: State) => state.preferencesStore.currency
  );
  const activeFilters = useSelector((state: State) => state.productFilterStore);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <TopBar
        left={{
          type: "buttonIcon",
          source: "chevron-left",
          function: () => {
            loadProducts(currency, activeFilters.service).then((r) => {
              Store.dispatch(ProductFilterSlice.actions.setShouldReload(true));
              navigation.goBack();
            });
          },
        }}
        middle={{
          type: "text",
          title: "products.filters.title",
        }}
        mb={0}
      />
      <ProductsFilterBlock body={productFilter} />
    </ScrollView>
  );
};
