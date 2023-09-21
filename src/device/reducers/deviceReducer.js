import { DEVICE_CONNECTIVITY_ONLINE, DEVICE_CONNECTIVITY_OFFLINE } from '../constants';

const initialState = {
  offline: false,
};

/**
 * Device reducer
 *
 * @param {Object} state
 * @param {Object} action
 *
 * @return {Object}
 */
export default function device(state = initialState, action) {
  const { type } = action;

  switch (type) {
    case DEVICE_CONNECTIVITY_ONLINE:
      return {
        ...state,
        offline: false,
      };

    case DEVICE_CONNECTIVITY_OFFLINE:
      return {
        ...state,
        offline: true,
      };

    default:
      return state;
  }
}
