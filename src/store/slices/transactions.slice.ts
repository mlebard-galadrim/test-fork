import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  transactions: [],
  types: [
    {
      value: "",
      label: "",
    },
  ],
};

const TransactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state, action) => ({
      ...state,
      transactions: action.payload,
    }),
    setTypes: (state, action) => ({ ...state, types: action.payload }),
    reset: (state) => ({ ...state, ...initialState }),
  },
});

export default TransactionsSlice;
