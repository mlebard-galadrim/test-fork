import { get } from "./utils.service";

export const getInvoicesCollection = async (currency) => {
  const res = await get(`/users/current/invoices`, {
    page: 1,
    limit: 100,
    currency,
  });
  return res;
};

export const getInvoicesStatuses = async () => {
  const res = await get(`/invoices/statuses`);
  return res;
};

export const getInvoicesTypes = async () => {
  const res = await get(`/invoices/types`);
  return res;
};
