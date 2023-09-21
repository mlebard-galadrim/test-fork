import { get } from "../utils.service";

export const getCountries = async () => {
  const res = await get(`/countries`);
  return res;
};
