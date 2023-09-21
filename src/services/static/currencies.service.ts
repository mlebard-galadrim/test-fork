import { get } from "../utils.service";

export const getCurrencies = async (type: undefined | "chart" | "performance" = undefined) => {
  const res = await get(`/currencies`, { type });
  return res;
};
