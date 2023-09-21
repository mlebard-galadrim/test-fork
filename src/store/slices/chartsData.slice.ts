import { createSlice } from "@reduxjs/toolkit";

const ChartsDataSlice = createSlice({
  name: "data",
  initialState: {
    tripleCurrencies: ["EUR", "USD", "GBP"],
    annualPerformance: [],
    metalPriceGraphic: [],
  },
  reducers: {
    setTripleCurrencies: (state, action) => ({ ...state, tripleCurrencies: action.payload }),
    setAnnualPerformances: (state, action) => ({ ...state, annualPerformances: action.payload }),
    setMetalPriceGraphic: (state, action) => ({ ...state, metalPriceGraphic: action.payload }),
  },
});

export default ChartsDataSlice;
