import { get } from "./utils.service";

export const getBankAccounts = async (currency) => {
  const res = await get(`/bank-accounts/${currency}`);
  return res;
};
