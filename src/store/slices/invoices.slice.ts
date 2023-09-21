import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  invoices: [],
  statuses: [],
  types: [
    {
      value: "",
      label: "",
    },
  ],
};

const InvoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    setInvoices: (state, action) => ({ ...state, invoices: action.payload }),
    setStatuses: (state, action) => ({ ...state, statuses: action.payload }),
    setTypes: (state, action) => ({ ...state, types: action.payload }),
    reset: (state) => ({ ...state, ...initialState }),
  },
});

export default InvoicesSlice;
