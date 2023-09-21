import { get } from 'k2/app/container';
import Transfer from 'k2/app/modules/transfer/models/Transfer';
import { updateLocalModificationCount } from 'k2/app/modules/authentication/actions/authenticationActions';

export const TRANSFER_RESET = 'TRANSFER_RESET';
export const TRANSFER_SELECT_SOURCE = 'TRANSFER_SELECT_SOURCE';
export const TRANSFER_SELECT_TARGET = 'TRANSFER_SELECT_TARGET';
export const TRANSFER_SET_LOAD = 'TRANSFER_SET_LOAD';
export const TRANSFER_CONFIRM = 'TRANSFER_CONFIRM';

export function selectSource(source) {
  return dispatch =>
    dispatch({
      type: TRANSFER_SELECT_SOURCE,
      payload: { source },
    });
}

/**
 * @param {Container} target
 */
export function selectTarget(target) {
  return dispatch =>
    dispatch({
      type: TRANSFER_SELECT_TARGET,
      payload: { target },
    });
}

/**
 * @param {Number} load
 */
export function transferLoad(load) {
  return dispatch =>
    dispatch({
      type: TRANSFER_SET_LOAD,
      payload: { load },
    });
}

export function confirm() {
  return (dispatch, getState) => {
    dispatch({ type: TRANSFER_CONFIRM });

    const { source, target, load } = getState().transferReducer;

    get('transfer_repository').save(() => Transfer.create(source, target, load));

    dispatch(updateLocalModificationCount());
  };
}

export function reset() {
  return dispatch => dispatch({ type: TRANSFER_RESET });
}
