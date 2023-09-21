import {
  TRANSFER_RESET,
  TRANSFER_CONFIRM,
  TRANSFER_SELECT_SOURCE,
  TRANSFER_SELECT_TARGET,
  TRANSFER_SET_LOAD,
} from 'k2/app/modules/transfer/actions/transferActions';

const initialState = {
  source: null,
  target: null,
  load: null,
};

/**
 * Transfer operations reducer
 *
 * @param {Object} state
 * @param {Object} action
 *
 * @return {Object}
 */
export default function (state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case TRANSFER_RESET:
      return { ...initialState };

    case TRANSFER_SELECT_SOURCE:
      return {
        ...state,
        source: payload.source,
      };

    case TRANSFER_SELECT_TARGET:
      return {
        ...state,
        target: payload.target,
      };

    case TRANSFER_SET_LOAD:
      return {
        ...state,
        load: payload.load,
      };

    case TRANSFER_CONFIRM:
      return { ...state };

    default:
      return state;
  }
}
