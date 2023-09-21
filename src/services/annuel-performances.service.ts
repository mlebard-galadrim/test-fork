import { get } from "./utils.service";

export const getAnnualPerformances = async (metal, currencies) => {
  const res = await get(`/annual-performances`, { metal, currencies });
  return res;
};
