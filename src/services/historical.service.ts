import { get } from "./utils.service";

export const getHistoricalRatio = async (date, metal1, metal2) => {
  const res = await get(`/ratios/${date}`, { metal1, metal2 });
  return res;
};

export const getHistoricalCollectionRatio = async (metal1, metal2, from?, to?) => {
  const max_elements = 100;
  if (from && to) {
    const res = await get(`/ratios`, {
      metal1,
      metal2,
      from,
      to,
      max_elements,
    });
    return res;
  } else {
    const res = await get(`/ratios`, { metal1, metal2, max_elements });
    return res;
  }
};

export const getHistoricalSpotPrice = async (date, metal, currency) => {
  const res = await get(`/historical-spot-prices/${date}`, { metal, currency });
  return res;
};

export const getHistoricalCollectionSpotPrice = async (metal, currency, from?, to?) => {
  const max_elements = 100;
  if (from && to) {
    const res = await get(`/historical-spot-prices`, {
      metal,
      currency,
      from,
      to,
      max_elements,
    });
    return res;
  } else {
    const res = await get(`/historical-spot-prices`, {
      metal,
      currency,
      max_elements,
    });
    return res;
  }
};
