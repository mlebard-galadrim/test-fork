import { ANALYSIS_CREATE, ANALYSIS_RESET, ANALYSIS_SET_NATURE } from '../constants';
import Analysis from '../models/Analysis';
import { get } from 'k2/app/container';
import { updateLocalModificationCount } from '../../authentication/actions/authenticationActions';

/**
 * @param {string} nature
 * @returns
 */
export function createAnalysis(uuid = null) {
  return dispatch => {
    dispatch({
      type: ANALYSIS_CREATE,
      payload: { uuid },
    });
  };
}

export function setAnalysisNature(nature) {
  return dispatch => {
    dispatch({ type: ANALYSIS_SET_NATURE, payload: { nature } });
  };
}

export function resetAnalysis() {
  return dispatch => {
    dispatch({
      type: ANALYSIS_RESET,
    });
  };
}

/**
 *
 * @param {Component} compressor
 * @param {AnalysisType} analysisType
 * @param {Kit} kit
 * @returns
 */
export function saveAnalysis(compressor, analysisType, kit, uuid = null) {
  return dispatch => {
    const analysis = Analysis.create(
      uuid,
      compressor.circuit.installation.id,
      compressor.uuid,
      analysisType,
      kit.barcode,
      new Date(),
    );

    const analysisRepository = get('analysis_repository');
    analysisRepository.save(analysis);

    const kitRepository = get('kit_repository');
    kitRepository.useKit(kit.barcode);

    dispatch(updateLocalModificationCount());
  };
}
