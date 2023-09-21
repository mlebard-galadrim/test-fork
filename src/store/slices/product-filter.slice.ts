import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shouldReload: false,
  price: null,
  metal: [],
  product: [],
  service: null,
};
const ProductFilterSlice = createSlice({
  name: "ProductFilters",
  initialState: initialState,
  reducers: {
    setPriceOrder: (state, action) => ({ ...state, price: action.payload }),
    setMetals: (state, action) => ({ ...state, metal: action.payload }),
    setProducts: (state, action) => ({ ...state, product: action.payload }),
    setServices: (state, action) => ({ ...state, service: action.payload }),
    setShouldReload: (state, action) => ({
      ...state,
      shouldReload: action.payload,
    }),

    reset: (state) => ({ ...initialState }),
  },
});

export default ProductFilterSlice;
