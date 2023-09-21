import { get } from 'k2/app/container';
import {
  SELECT_DETECTOR_SUCCESS,
  SELECT_DETECTOR_UNKNOWN,
  GET_LAST_DETECTOR,
  CONFIRM_DETECTOR_SELECTION,
  CANCEL_DETECTOR_SELECTION,
} from '../constants';

/**
 * Confirm detector selection
 *
 * @param {Detector} detector
 */
export function confirmDetectorSelection(detector) {
  return dispatch =>
    dispatch({
      type: CONFIRM_DETECTOR_SELECTION,
      payload: { detector },
    });
}

/**
 * Cancel detector selection
 */
export function cancelDetectorSelection() {
  return dispatch => dispatch({ type: CANCEL_DETECTOR_SELECTION });
}

/**
 * Dispatch current detector selection
 *
 * @param {String} barcode Scanned barcode or any barcode if entered manually
 */
export function selectDetector(barcode) {
  return dispatch => {
    const detector = get('detector_repository').findByBarcodeOrSerialNumber(barcode);

    if (!detector) {
      return dispatch({
        type: SELECT_DETECTOR_UNKNOWN,
        payload: { barcode },
      });
    }

    return dispatch({
      type: SELECT_DETECTOR_SUCCESS,
      payload: { detector },
    });
  };
}

/**
 * Try to get the last user detector
 */
export function getLastDetector() {
  return dispatch => {
    const detector = get('intervention_repository').getLastUsedDetector();

    return dispatch({
      type: GET_LAST_DETECTOR,
      payload: { detector },
    });
  };
}

/**
 * Create new detector
 *
 * @param {Object} data
 */
export function createDetector(data) {
  return (dispatch, getState) => {
    /** @type Security */
    const security = get('security');
    const client = security.getUserClient();
    const detector = get('detector_repository').findOrCreate(
      client,
      data.serialNumber,
      data.barcode,
      data.designation,
      data.lastInspectionDate,
      data.mark,
    );

    dispatch(selectDetector(detector.serialNumber));
  };
}
