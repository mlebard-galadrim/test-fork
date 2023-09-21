import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: { newMessage: true, newPublication: true },
  subscribedToInAppNewsletter: true,
  metalsNewsletter: false,
  storageFeePeriod: false,
  currency: "EUR",
  pin: "",
};

const PreferencesSlice = createSlice({
  name: "preference",
  initialState: initialState,
  reducers: {
    setNotifications: (state, action) => ({
      ...state,
      notifications: action.payload,
    }),
    setCurrency: (state, action) => ({
      ...state,
      currency: action.payload,
    }),
    setMetalsNewsletter: (state, action) => ({ ...state, metalsNewsletter: action.payload }),
    setSubscribedToInAppNewsletter: (state, action) => ({ ...state, subscribedToInAppNewsletter: action.payload }),
    setStorageFeePeriod: (state, action) => ({ ...state, storageFeePeriod: action.payload }),
    setPin: (state, action) => ({ ...state, pin: action.payload }),
    resetPin: (state) => ({ ...state, pin: "" }),
    reset: () => ({ ...initialState }),
  },
});

export default PreferencesSlice;
