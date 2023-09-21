import AbstractPipe from '../../common/orchestrator/AbstractPipe';
import { PIPE_PURPOSE, PIPE_LEAK_DETECTION_SHUNT } from '../constants';

class LeakPipe extends AbstractPipe {
  /**
   * @param {ClientPipe} installationClientPipe
   * @param {DetectorPipe} detectorPipe
   * @param {Validator} validator
   */
  constructor(installationClientPipe, detectorPipe, validator) {
    super();

    this.installationClientPipe = installationClientPipe;
    this.detectorPipe = detectorPipe;
    this.validator = validator;
  }

  /**
   * {@inheritDoc}
   */
  getStep(state) {
    const { intervention } = state.interventionPipe;

    if (!intervention.installation) {
      return this.installationClientPipe.getStep(state);
    }

    if (!intervention.detector) {
      return this.detectorPipe.getStep(state);
    }

    if (!intervention.purpose) {
      return PIPE_PURPOSE;
    }

    if (!this.validator.isInterventionComplete()) {
      return PIPE_LEAK_DETECTION_SHUNT;
    }

    return null;
  }
}

export default LeakPipe;
