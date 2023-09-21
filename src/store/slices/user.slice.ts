import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  firstname: "",
  lastname: "",
  balances: [],
  currency: "EUR",
  picture: "",
  address_status: 0,
  bank_account_status: 0,
  identity_status: 0,
  legalStatus: 1,
  statuses: [],
  shouldReloadMessages: true,
};

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setFirstname: (state, action) => ({ ...state, firstname: action.payload }),
    setLastname: (state, action) => ({ ...state, lastname: action.payload }),
    setBalances: (state, action) => ({ ...state, balances: action.payload }),
    setPicture: (state, action) => ({ ...state, picture: action.payload }),
    setUserId: (state, action) => ({ ...state, userId: action.payload }),
    setLegalStatus: (state, action) => ({ ...state, legalStatus: action.payload }),
    setAddressStatus: (state, action) => ({
      ...state,
      address_status: action.payload,
    }),
    setBankAccountStatus: (state, action) => ({
      ...state,
      bank_account_status: action.payload,
    }),
    setIdentityStatus: (state, action) => ({
      ...state,
      identity_status: action.payload,
    }),
    setStatuses: (state, action) => ({ ...state, statuses: action.payload }),
    setShouldReloadMessages: (state, action) => ({ ...state, shouldReloadMessages: action.payload }),
    setCurrency: (state, action) => ({ ...state, currency: action.payload }),
    reset: (state) => ({ ...state, ...initialState }),
  },
});

export default UserSlice;
