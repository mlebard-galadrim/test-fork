import axios from "axios";
import { environment } from "../environments";
import { Store } from "../store/configure.store";
import { resetTokenAndReattemptRequest } from "./token.service";

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const errorResponse = error.response;

    if (errorResponse && errorResponse.status === 400) {
      return errorResponse;
    }

    if (errorResponse && errorResponse.status === 401) {
      return resetTokenAndReattemptRequest(error);
    }
    return Promise.reject(errorResponse);
  }
);

// axios.interceptors.request.use(function (config) {
//   const token = Store.getState().authStore.token;
//   config.headers.Authorization = token;

//   return config;
// });

export const genHeaders = () => {
  const state = Store.getState();
  const token = state.authStore.token;
  const locale = state.appStore.locale;

  let headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": locale,
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const queryBuilder = (query) => {
  let queryBuilder = "?";

  Object.keys(query).forEach((key) => {
    if (query[key]) {
      Array.isArray(query[key])
        ? query[key].map((k) => {
            queryBuilder += `${key}[]=${k}&`;
          })
        : (queryBuilder += `${key}=${query[key]}&`);
    }
  });
  return queryBuilder;
};

export const put = async (route, object) => {
  console.log("ICIPut " + environment.apiUrl + route);
  let headers = genHeaders();
  const res = await axios({
    method: "put",
    url: environment.apiUrl + route,
    data: JSON.stringify(object),
    headers: headers,
    maxRedirects: 0,
  });
  return res;
};

export const get = async (route, object?) => {
  console.log("ICIGet " + environment.apiUrl + route);
  let parameter = "";

  if (object) {
    parameter = queryBuilder(object);
  }
  let headers = genHeaders();
  const res = await axios.get(environment.apiUrl + route + parameter, {
    headers,
  });
  if (res.status !== 200) {
    console.warn(res.status, route);
  }

  return res.data;
};

export const del = async (route) => {
  let headers = genHeaders();
  const res = await axios.delete(environment.apiUrl + route, {
    headers,
  });
  return res.data;
};

export const post = async (route, object) => {
  console.log("ICIPost " + environment.apiUrl + route);
  let headers = genHeaders();

  const res = await axios({
    method: "post",
    url: environment.apiUrl + route,
    data: JSON.stringify(object),
    headers: headers,
    maxRedirects: 0,
  });

  return res.data;
};

export const postFormData = async (route, object) => {
  let headers = genHeaders();

  const res = await axios.post(environment.apiUrl + route, object.data, {
    headers,
  });
  return res.data;
};

export const patch = async (route, object) => {
  // console.log("ICIPatch " + environment.apiUrl + route);
  let headers = genHeaders();
  const res = await axios({
    method: "patch",
    url: environment.apiUrl + route,
    headers,
    data: JSON.stringify(object),
  });

  return res.data;
};

export const rawpost = async (route, object) => {
  console.log("ICIPost " + environment.apiUrl + route);
  let headers = genHeaders();

  const res = await axios.post(environment.apiUrl + route, JSON.stringify(object), {
    headers,
  });
  return res;
};
