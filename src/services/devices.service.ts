import { Platform } from "react-native";
import { get, post, put } from "./utils.service";

const type = Platform.OS === "android" ? 2 : 1;

export const createDevice = async (token, newsNotifications, messageNotifications, locale) => {
  const res = await post(`/devices`, {
    type,
    token,
    newsNotifications,
    messageNotifications,
    locale,
  });

  return res.status;
};

export const editDevice = async (token, newsNotifications, messageNotifications, locale) => {
  const res = await put(`/devices/${type}-${token}`, {
    newsNotifications,
    messageNotifications,
    locale,
  });
  return res.status;
};

export const getDevice = async (token) => {
  const res = await get(`/devices/${type}-${token}`);
  return res;
};
