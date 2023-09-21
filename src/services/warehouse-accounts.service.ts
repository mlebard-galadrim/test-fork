import { Store } from "../store/configure.store";
import { get } from "./utils.service";

export const getWarehouseAccount = async (id) => {
  const userId = Store.getState().userStore.userId;
  const res = await get(`/users/${userId}/warehouse-accounts/${id}`);
  return res;
};

export const getWarehouseAccountCollection = async () => {
  const userId = Store.getState().userStore.userId;
  const res = await get(`/users/${userId}/warehouse-accounts`);
  return res;
};
