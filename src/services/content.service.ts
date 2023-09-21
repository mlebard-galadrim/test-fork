import { get } from "./utils.service";

export const getContent = async (id) => {
  const res = await get(`/contents/${id}`);
  return res;
};

export const getCollectionContent = async () => {
  const res = await get(`/contents/`);
  return res;
};
