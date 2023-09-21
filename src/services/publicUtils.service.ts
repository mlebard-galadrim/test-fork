import axios from "axios";
import { environment } from "../environments";
import { Store } from "../store/configure.store";

const axiosNoAuth = axios.create();

export const genHeaders = () => {
  const state = Store.getState();
  const locale = state.appStore.locale;
  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": locale,
  };
  return headers;
};

export const queryBuilder = (query) => {
  let queryBuilder = "?";

  Object.keys(query).forEach((key) => {
    Array.isArray(query[key])
      ? query[key].map((k) => {
          queryBuilder += `${key}[]=${k}&`;
        })
      : (queryBuilder += `${key}=${query[key]}&`);
  });
  return queryBuilder;
};

export const putPublic = async (route, object) => {
  // console.log("ICIPut " + environment.apiUrl + route);
  let headers = genHeaders();
  return await axiosNoAuth.put(environment.apiUrl + route, {
    headers,
    body: JSON.stringify(object),
  });
};

export const getPublic = async (route, object?) => {
  let parameter = "";
  if (object) {
    parameter = queryBuilder(object);
  }
  // console.log("ICIGet " + environment.apiUrl + route + parameter);
  let headers = genHeaders();

  const res = await axiosNoAuth.get(environment.apiUrl + route + parameter, {
    headers,
  });
  if (res.status !== 200) {
    console.warn(res.status, route);
  }

  return res.data;
};

export const delPublic = async (route) => {
  let headers = genHeaders();
  const res = await axiosNoAuth.delete(environment.apiUrl + route, {
    headers,
  });
  return res.data;
};

export const postPublic = async (route, object) => {
  // console.log("ICIPost " + environment.apiUrl + route);
  let headers = genHeaders();
  const res = await axiosNoAuth.post(environment.apiUrl + route, JSON.stringify(object), {
    headers,
  });
  return res.data;
};

export const postFormDataPublic = async (route, object) => {
  let headers = genHeaders();

  // console.log("ICIPost " + environment.apiUrl + route);
  const res = await axiosNoAuth.post(environment.apiUrl + route, object.data, {
    headers,
  });

  return res.data;
};

export const patchPublic = async (route, object) => {
  // console.log("ICIPatch " + environment.apiUrl + route);
  let headers = genHeaders();
  const res = await axiosNoAuth
    .patch(environment.apiUrl + route, JSON.stringify(object), {
      headers,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
  return res;
};

export const rawpostPublic = async (route, object) => {
  const state = Store.getState();
  const token = state.authStore.token;
  // console.log("ICIPost " + environment.apiUrl + route);

  let headers = {
    Accept: "text/html",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const res = await axiosNoAuth.post(environment.apiUrl + route, JSON.stringify(object), {
    headers,
    responseType: "text",
  });

  return await res;
};
