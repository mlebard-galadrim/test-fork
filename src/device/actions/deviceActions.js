import { DEVICE_CONNECTIVITY_ONLINE, DEVICE_CONNECTIVITY_OFFLINE } from '../constants';

export function connectivity(isConnected) {
  return dispatch => {
    dispatch({
      type: isConnected ? DEVICE_CONNECTIVITY_ONLINE : DEVICE_CONNECTIVITY_OFFLINE,
    });
  };
}
