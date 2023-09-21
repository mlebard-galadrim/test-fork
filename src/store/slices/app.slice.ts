import { createSlice } from "@reduxjs/toolkit";
import i18n from "i18n-js";
const AppSlice = createSlice({
  name: "app",
  initialState: {
    firstlaunch: true,
    locale: undefined,
    timezone: "",
    notificationId: "",
    lastPinDate: new Date(),
    newLastPinDate: new Date(),
    now: new Date(),
    shouldAskPin: true,
    shouldNavigateMessages: false,
  },
  reducers: {
    setFirstLaunch: (state, action) => ({
      ...state,
      firstlaunch: action.payload,
    }),
    setLocale: (state, action) => {
      i18n.locale = action.payload;
      return {
        ...state,
        locale: action.payload,
      };
    },
    setTimeZone: (state, action) => {
      return {
        ...state,
        timezone: action.payload,
      };
    },
    setNotificationId: (state, action) => ({
      ...state,
      notificationId: action.payload,
    }),
    setLastPinDate: (state, action) => ({
      ...state,
      lastPinDate: action.payload,
    }),
    setNewLastPinDate: (state, action) => ({
      ...state,
      newLastPinDate: action.payload,
    }),
    setNow: (state, action) => ({
      ...state,
      now: action.payload,
    }),
    setShouldAskPin: (state, action) => ({
      ...state,
      shouldAskPin: action.payload,
    }),
    setShouldNavigateMessages: (state, action) => ({
      ...state,
      shouldNavigateMessages: action.payload,
    }),
    setFromLogin: (state, action) => ({
      ...state,
      now: action.payload.now,
      shouldAskPin: action.payload.shouldAskPin,
      lastPinDate: action.payload.lastPinDate,
    }),
    transferPinDate: (state) => ({
      ...state,
      lastPinDate: state.newLastPinDate,
      newLastPinDate: new Date(),
    }),
  },
});

export default AppSlice;
