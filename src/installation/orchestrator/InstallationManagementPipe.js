import AbstractPipe from '../../common/orchestrator/AbstractPipe';
import {
  PIPE_INSTALLATION_MANAGEMENT_INFO,
  PIPE_INSTALLATION_MANAGEMENT_CIRCUIT,
  PIPE_INSTALLATION_MANAGEMENT_INSTALLATION_SELECTION,
  PIPE_INSTALLATION_MANAGEMENT_SITE_SELECTION,
  PIPE_INSTALLATION_MANAGEMENT_CLIENT_SELECTION,
} from '../constants';

class InstallationManagementPipe extends AbstractPipe {
  /**
   * {@inheritDoc}
   */
  getStep(state) {
    const { installation, circuit } = state.installationManagementReducer;
    const { client, site } = state.installationPipe;

    if (!client) {
      return PIPE_INSTALLATION_MANAGEMENT_CLIENT_SELECTION;
    }

    if (!site) {
      return PIPE_INSTALLATION_MANAGEMENT_SITE_SELECTION;
    }

    if (!installation) {
      return PIPE_INSTALLATION_MANAGEMENT_INSTALLATION_SELECTION;
    }

    if (!circuit) {
      return PIPE_INSTALLATION_MANAGEMENT_INFO;
    }

    return PIPE_INSTALLATION_MANAGEMENT_CIRCUIT;
  }
}

export default InstallationManagementPipe;
