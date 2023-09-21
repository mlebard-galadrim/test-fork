import { get } from "./utils.service";

export const getMenu = async (id) => {
  const res = await get(`/menus/${id}`);
  return res;
};
