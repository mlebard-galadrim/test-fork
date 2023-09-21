import { get } from "../utils.service";

export const getPhones = async () => {
  const res = await get(`/configs/current`);
  return res;
};
