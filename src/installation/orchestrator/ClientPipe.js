import AbstractPipe from '../../common/orchestrator/AbstractPipe';
import { PIPE_CLIENT_SELECTION, PIPE_SITE_SELECTION, PIPE_INSTALLATION_INTERVENTION_SELECTION } from '../constants';

class ClientPipe extends AbstractPipe {
  /**
   * @inheritDoc
   *
   * @returns {String}
   */
  getStep(state, installationAction = PIPE_INSTALLATION_INTERVENTION_SELECTION) {
    const { client, site } = state.installationPipe;

    if (!client) {
      return PIPE_CLIENT_SELECTION;
    }

    if (!site) {
      return PIPE_SITE_SELECTION;
    }

    return installationAction;
  }
}

export default ClientPipe;
