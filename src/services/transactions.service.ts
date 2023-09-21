import { get } from "./utils.service";

export const getTransactionsCollection = async (currency) => {
  const res = await get(`/users/current/transactions`, {
    page: 1,
    limit: 500,
    currency,
  });
  return res;
};

export const getTransactionsTypes = async () => {
  const res = await get(`/transactions/types`);
  return res;
};
