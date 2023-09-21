import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mail: "",
  firstname: "",
  lastname: "",
  companyName: "",
  legalStatus: 1,
  password: "",
  secondPassword: "",
  metalNewsletter: true,
  subscribedToInAppNewsletter: true,
  tosRead: false,
  error: {} as any,
};
const RegisterSlice = createSlice({
  name: "ProductFilters",
  initialState: initialState,
  reducers: {
    setMail: (state, action) => ({ ...state, mail: action.payload }),
    setFirstname: (state, action) => ({ ...state, firstname: action.payload }),
    setLastname: (state, action) => ({ ...state, lastname: action.payload }),
    setCompanyName: (state, action) => ({ ...state, companyName: action.payload }),
    setLegalstatus: (state, action) => ({
      ...state,
      legalStatus: action.payload,
    }),
    setPassword: (state, action) => ({ ...state, password: action.payload }),
    setSecondPassword: (state, action) => ({ ...state, secondPassword: action.payload }),
    switchTosRead: (state) => ({ ...state, tosRead: !state.tosRead }),
    setError: (state, action) => ({ ...state, error: action.payload }),
    setMetalNewsletter: (state, action) => ({
      ...state,
      metalNewsletter: action.payload,
    }),
    setSubscribedToInAppNewsletter: (state, action) => ({
      ...state,
      subscribedToInAppNewsletter: action.payload,
    }),

    reset: (state) => ({ ...initialState }),
  },
});

export default RegisterSlice;
