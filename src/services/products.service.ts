import { get } from "./utils.service";

export const getProduct = async (id) => {
  const res = await get(`/products/${id}`);
  return res;
};

// Need authentication for this service
export const getProductCollection = async (currency, service?) => {
  if (service) {
    const res = await get(`/products`, {
      page: 1,
      limit: 500,
      currency,
      service,
    });
    return res;
  } else {
    const res = await get(`/products`, { page: 1, limit: 500, currency });
    return res;
  }
};
