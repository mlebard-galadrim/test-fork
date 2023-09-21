import AbstractPipe from '../../common/orchestrator/AbstractPipe';
import {
  PIPE_PURPOSE,
  PIPE_CONTAINER_LOAD,
  PIPE_FILLING_DRAINAGE_SHUNT,
  PIPE_DRAINAGE_FILLING_SUMUP,
  INTERVENTION_INVITE_SCAN_CONTAINER,
} from '../constants';

/**
 * Drainage or filling intervention pipe.
 */
class DrainageFillingPipe extends AbstractPipe {
  /**
   * @param {ClientPipe} installationClientPipe
   * @param {Validator} validator
   */
  constructor(installationClientPipe, validator) {
    super();

    this.installationClientPipe = installationClientPipe;
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

    if (!intervention.purpose) {
      return PIPE_PURPOSE;
    }

    // Pre-filled commissionning
    if (this.validator.isPreFilledCommissioning()) {
      return PIPE_DRAINAGE_FILLING_SUMUP;
    }

    if (intervention.containerLoads.length === 0) {
      return INTERVENTION_INVITE_SCAN_CONTAINER;
    }

    if (!intervention.areContainerLoadsValid()) {
      return PIPE_CONTAINER_LOAD;
    }

    if (!this.validator.isInterventionComplete()) {
      return PIPE_FILLING_DRAINAGE_SHUNT;
    }

    return null;
  }
}

export default DrainageFillingPipe;
