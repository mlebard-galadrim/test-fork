import {
  SELECT_KIT_SUCCESS,
  SELECT_KIT_UNKNOWN,
  CANCEL_KIT_SELECTION,
  ANALYSIS_CREATE,
  ANALYSIS_SET_NATURE,
  ANALYSIS_RESET,
} from '../constants';

const initialState = {
  /** @type {Kit|null} Kit matching filled barcode if any */
  kit: null,
  /** @type {string|null} Current filled barcode */
  barcode: null,
  /** @type {string|null} Nature (eg: oil) of the current analysis */
  analysis: null,
  /** @type {string|null} The analysis' uuid */
  uuid: null,
};

export default function analysisPipe(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ANALYSIS_CREATE:
      return {
        ...state,
        uuid: payload.uuid,
      };
    case ANALYSIS_SET_NATURE:
      return {
        ...state,
        analysis: payload.nature,
      };

    case SELECT_KIT_SUCCESS:
      return {
        ...state,
        kit: payload.kit,
        barcode: payload.kit.barcode,
      };

    case CANCEL_KIT_SELECTION:
      return initialState;

    case SELECT_KIT_UNKNOWN:
      return {
        ...state,
        kit: null,
        barcode: payload.barcode,
      };

    case ANALYSIS_RESET:
      return initialState;

    default:
      return state;
  }
}
