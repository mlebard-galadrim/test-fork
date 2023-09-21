import { get } from "../utils.service";

export const getCollectionLocales = async () => {
  return await get(`/locales`);
};
