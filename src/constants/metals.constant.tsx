import MetalsSlice from "../store/slices/metals.slice";

export const metalsConstant = [
  {
    id: "XAU",
    name: "metals.XAU",
    action: MetalsSlice.actions.setXAU,
  },
  {
    id: "XAG",
    name: "metals.XAG",
    action: MetalsSlice.actions.setXAG,
  },
  {
    id: "XPD",
    name: "metals.XPD",
    action: MetalsSlice.actions.setXPD,
  },
  {
    id: "XPT",
    name: "metals.XPT",
    action: MetalsSlice.actions.setXPT,
  },
];
