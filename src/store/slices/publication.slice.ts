import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  publications: [],
};

const PublicationsSlice = createSlice({
  name: "publications",
  initialState,
  reducers: {
    setPublications: (state, action) => ({
      ...state,
      publications: action.payload,
    }),
    resetState: () => initialState,
  },
});

export default PublicationsSlice;
