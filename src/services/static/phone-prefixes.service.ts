import { get } from "../utils.service";

export const getPhonePrefixesCollection = async () => {
  const res = await get(`/phone-prefixes`);
  return res;
};
