import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  metals: [],
  publicationTags: [],
  publicationsPagination: [],
  authors: [],
  currencies: [],
  selectedCurrency: "EUR",
  locales: [],
};

const DataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setMetals: (state, action) => ({ ...state, metals: action.payload }),
    setPublicationsPagination: (state, action) => ({
      ...state,
      publicationsPagination: action.payload,
    }),
    setProducts: (state, action) => ({ ...state, products: action.payload }),
    setAuthors: (state, action) => ({ ...state, authors: action.payload }),
    setPublicationTags: (state, action) => ({
      ...state,
      publicationTags: action.payload,
    }),
    setCurrencies: (state, action) => ({
      ...state,
      currencies: action.payload,
    }),
    setSelectedCurrency: (state, action) => ({
      ...state,
      selectedCurrency: action.payload,
    }),
    setLocales: (state, action) => ({
      ...state,
      locales: action.payload,
    }),
    resetState: () => initialState,
  },
});

export default DataSlice;
