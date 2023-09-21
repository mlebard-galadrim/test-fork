import {
  SELECT_DETECTOR_SUCCESS,
  SELECT_DETECTOR_UNKNOWN,
  GET_LAST_DETECTOR,
  CANCEL_DETECTOR_SELECTION,
} from '../constants';
import { INTERVENTION_CREATE, INTERVENTION_SAVED } from '../../intervention/constants';

const initialState = {
  detector: null,
  barcode: null,
  lastDetector: null,
};

/**
 * Update selected detector store with current detector informations
 *
 * @param {Object}   state
 * @param {Detector} detector
 */
function handleSelectDetector(state, detector) {
  return {
    ...state,
    detector,
    barcode: detector.barcode,
  };
}

/**
 * Update selected detector store with unknown detector
 *
 * @param {Object} state
 * @param {String} barcode
 */
function handleUnknownDetector(state, barcode) {
  return {
    ...state,
    detector: null,
    barcode,
  };
}

/**
 * Update selected detector store with the last detector
 *
 * @param {Object}        state
 * @param {Detector|null} detector
 */
function handleLastDetector(state, detector) {
  return {
    ...state,
    lastDetector: detector,
  };
}

/**
 * Reset selected detector store
 */
function handleResetDetector() {
  return initialState;
}

/**
 * Select detector pipe reducer
 *
 * @param {Object} state
 * @param {Object} action
 *
 * @return {Object}
 */
export default function selectDetectorPipe(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case SELECT_DETECTOR_SUCCESS:
      return handleSelectDetector(state, payload.detector);
    case SELECT_DETECTOR_UNKNOWN:
      return handleUnknownDetector(state, payload.barcode);
    case GET_LAST_DETECTOR:
      return handleLastDetector(state, payload.detector);
    case INTERVENTION_CREATE:
    case INTERVENTION_SAVED:
    case CANCEL_DETECTOR_SELECTION:
      return handleResetDetector();
    default:
      return state;
  }
}
