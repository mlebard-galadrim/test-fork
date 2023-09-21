import axios from "axios";
import * as Updates from "expo-updates";
import { Store } from "../store/configure.store";
import AuthSlice from "../store/slices/auth.slice";
import { postPublic } from "./publicUtils.service";

let isAlreadyFetchingAccessToken = false;
// This is the list of waiting requests that will retry after the JWT refresh complete
let subscribers = [];

export const resetTokenAndReattemptRequest = async (error) => {
  try {
    const { response: errorResponse } = error;

    const resetToken = Store.getState().authStore.refresh_token; // Your own mechanism to get the refresh token to refresh the JWT token

    const retryOriginalRequest = new Promise((resolve) => {
      addSubscriber((access_token) => {
        errorResponse.config.headers.Authorization = "Bearer " + access_token;
        resolve(axios(errorResponse.config));
      });
    });

    if (!isAlreadyFetchingAccessToken) {
      isAlreadyFetchingAccessToken = true;
      await postPublic(`/token/refresh`, {
        refresh_token: resetToken,
      })
        .then((res) => {
          Store.dispatch(AuthSlice.actions.setToken(res.token));
          Store.dispatch(AuthSlice.actions.setRefreshToken(res.refresh_token));
          isAlreadyFetchingAccessToken = false;
          onAccessTokenFetched(res.token);
        })
        .catch((err) => {
          Store.dispatch(AuthSlice.actions.reset());
          Updates.reloadAsync();
        });
    }
    return retryOriginalRequest;
  } catch (err) {
    return Promise.reject(err);
  }
};

function onAccessTokenFetched(access_token) {
  // When the refresh is successful, we start retrying the requests one by one and empty the queue
  subscribers.forEach((callback) => callback(access_token));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}
