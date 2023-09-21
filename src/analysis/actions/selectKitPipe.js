import { get } from 'k2/app/container';
import { SELECT_KIT_SUCCESS, SELECT_KIT_UNKNOWN, CANCEL_KIT_SELECTION } from '../constants';

/**
 * Cancel kit selection
 */
export function cancelKitSelection() {
  return dispatch => dispatch({ type: CANCEL_KIT_SELECTION });
}

/**
 * Dispatch current kit selection
 *
 * @param {String} barcode Scanned barcode or any barcode if entered manually
 */
export function selectKit(barcode) {
  return dispatch => {
    const kit = get('kit_repository').findByBarcode(barcode);
    if (kit) {
      return dispatch({
        type: SELECT_KIT_SUCCESS,
        payload: { kit },
      });
    }
    return dispatch({
      type: SELECT_KIT_UNKNOWN,
      payload: { barcode },
    });
  };
}
