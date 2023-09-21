import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bulletins: [],
};

const BulletinsSlice = createSlice({
  name: "publications",
  initialState,
  reducers: {
    setBulletins: (state, action) => ({
      ...state,
      bulletins: action.payload,
    }),
    resetState: () => initialState,
  },
});

export default BulletinsSlice;
