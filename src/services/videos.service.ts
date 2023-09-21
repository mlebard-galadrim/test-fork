import { get } from "./utils.service";

export const getVideos = async (page: number = 1, limit: number = 20) => {
  const res = await get(`/videos`, { page, limit });
  return res;
};
