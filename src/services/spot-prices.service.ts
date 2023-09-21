import { get } from "./utils.service";

export const getCurrentSpotPrice = async (metal, currency, weight_unit?) => {
  console.log("metal, currency, weight", metal, currency, weight_unit);
  const res = await get(`/spot-price`, { metal, currency, weight_unit });
  return res;
};

export const getSpotPricesCollection = async (metal, currency) => {
  const max_elements = 100;
  return await get(`/spot-prices`, { metal, currency, max_elements });
};
