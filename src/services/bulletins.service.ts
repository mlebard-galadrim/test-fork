import { get } from "./utils.service";

export const getBulletins = async (page: number = 1, limit: number = 20) => {
  return await get(`/bulletins`, { page, limit });
};

export const getBulletinById = async (id: number) => {
  return await get(`/bulletins/${id}`);
};

export const downloadBulletinById = async (id: number) => {
  return await get(`/bulletins/${id}/download`);
};
