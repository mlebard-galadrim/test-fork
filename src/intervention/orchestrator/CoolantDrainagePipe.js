import AbstractPipe from '../../common/orchestrator/AbstractPipe';
import { PIPE_SELECT_COOLANT_CONTAINERS, PIPE_COOLANT_TRANSITION } from '../constants';

/**
 * Drainage or filling intervention pipe.
 */
class CoolantDrainagePipe extends AbstractPipe {
  /**
   * @param {ClientPipe} installationClientPipe
   * @param {Validator} validator
   */
  constructor(installationClientPipe, validator) {
    super();

    this.installationClientPipe = installationClientPipe;
  }

  /**
   * {@inheritDoc}
   */
  getStep(state) {
    const { intervention } = state.interventionPipe;

    if (!intervention.installation) {
      return this.installationClientPipe.getStep(state);
    }

    if (intervention.coolantContainers.length === 0) {
      return PIPE_SELECT_COOLANT_CONTAINERS;
    }

    return PIPE_COOLANT_TRANSITION;
  }
}

export default CoolantDrainagePipe;
