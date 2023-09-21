import { get, patch, post, postFormData, put } from "./utils.service";

export const getProfileInfo = async () => {
  const res = await get(`/users/current`);
  return res;
};

// Need authentication
export const getUserStock = async (metal) => {
  const res = await get(`/users/current/stock`, {
    page: 1,
    limit: 500,
    metal,
  });
  return res;
};

export const getUserCollection = async () => {
  const res = await get(`/users`);
  return res;
};

export const createUser = async (
  legalStatus,
  companyName,
  firstname,
  lastname,
  email,
  password,
  secondPassword,
  subscribedToInAppNewsletter,
  tosRead
) => {
  const res = await post(`/users`, {
    legalStatus,
    companyName,
    firstname,
    lastname,
    email,
    password: { first: password, second: secondPassword },
    subscribedToInAppNewsletter: subscribedToInAppNewsletter === true ? 1 : 0,
    acceptTermsAndConditions: tosRead,
  });
  if (res.status === 201) {
    return { code: res.status };
  } else {
    return res;
  }
};

export const resetUserPassword = async (email) => {
  const res = await patch(`/users/reset`, { email });
  return res;
};

export const getProfileStatuses = async () => {
  const res = await get(`/users/statuses`);
  return res;
};

export const getFounders = async () => {
  const res = await get(`/users/founders`);
  return res;
};

export const postAddressDocument = async (data) => {
  const res = await postFormData(`/users/current/profile/address`, {
    data,
  });
  return res;
};

export const postBankDocument = async (data) => {
  const res = await postFormData(`/users/current/profile/bank-account`, {
    data,
  });
  return res;
};

export const postIdentityDocument = async (data) => {
  const res = await postFormData(`/users/current/profile/identity`, {
    data,
  });
  return res;
};

export const getUserPreferences = async () => {
  const res = await get("/users/current/preferences");
  return res;
};

export const updateUserPreferences = async ({ timezone, currency, locale, storageFeePeriod, subscribedToInAppNewsletter }) => {
  const res = await put("/users/current/preferences", {
    timezone,
    currency,
    locale,
    storageFeePeriod,
    subscribedToInAppNewsletter,
  });
  return res;
};
