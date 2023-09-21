import { get } from "../utils.service";

export const getMetalsCollection = async () => {
  const res = await get(`/metals`);
  return res;
};
