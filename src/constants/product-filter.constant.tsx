import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import ProductFilterSlice from "../store/slices/product-filter.slice";

type ProductFilter = {
  id: string;
  title: string;
  choices: string[] | { id: number; title: string }[];
  action: ActionCreatorWithPayload<any, string>;
};

export const productFilter: ProductFilter[] = [
  {
    id: "price",
    title: "products.filters.byPrice.title",
    choices: [
      "products.filters.byPrice.categories.increasing",
      "products.filters.byPrice.categories.decreasing",
    ],
    action: ProductFilterSlice.actions.setPriceOrder,
  },
  {
    id: "metal",
    title: "products.filters.byMetal.title",
    choices: [
      "products.filters.byMetal.categories.gold",
      "products.filters.byMetal.categories.silver",
      "products.filters.byMetal.categories.palladium",
      "products.filters.byMetal.categories.platinum",
    ],
    action: ProductFilterSlice.actions.setMetals,
  },
  {
    id: "product",
    title: "products.filters.byProduct.title",
    choices: [
      "products.filters.byProduct.categories.bar",
      "products.filters.byProduct.categories.coin",
    ],
    action: ProductFilterSlice.actions.setProducts,
  },
  {
    id: "service",
    title: "products.filters.byService.title",
    choices: [
      {
        id: 2,
        title: "products.filters.byService.categories.storage",
      },
      {
        id: 3,
        title: "products.filters.byService.categories.delivery",
      },
    ],
    action: ProductFilterSlice.actions.setServices,
  },
];

export const metalConvert = {
  XAU: "products.filters.byMetal.categories.gold",
  XAG: "products.filters.byMetal.categories.silver",
  XPD: "products.filters.byMetal.categories.palladium",
  XPT: "products.filters.byMetal.categories.platinum",
};

export const productTypeConvert = {
  bar: "products.filters.byProduct.categories.bar",
  coin: "products.filters.byProduct.categories.coin",
};
