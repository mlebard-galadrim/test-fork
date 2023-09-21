import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    refresh_token: null,
  },
  reducers: {
    setToken: (state, action) => ({
      ...state,
      token: action.payload,
    }),
    setRefreshToken: (state, action) => ({
      ...state,
      refresh_token: action.payload,
    }),
    reset: (state) => {
      return {
        ...state,
        token: null,
        refresh_token: null,
      };
    },
  },
});

export default AuthSlice;
