import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  XAU: {},
  XAG: {},
  XPT: {},
  XPD: {},
};

const MetalsSlice = createSlice({
  name: "metals",
  initialState,
  reducers: {
    setXAU: (state, action) => ({ ...state, XAU: action.payload }),
    setXAG: (state, action) => ({ ...state, XAG: action.payload }),
    setXPT: (state, action) => ({ ...state, XPT: action.payload }),
    setXPD: (state, action) => ({ ...state, XPD: action.payload }),
    resetState: () => initialState,
  },
});

export default MetalsSlice;
