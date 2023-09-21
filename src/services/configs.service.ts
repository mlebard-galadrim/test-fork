import { get } from "./utils.service";

export const getBeandeauNews = async () => {
  const res = await get("/configs/current");
  return res;
};
