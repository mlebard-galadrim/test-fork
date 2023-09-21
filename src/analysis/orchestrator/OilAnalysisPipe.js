import AbstractPipe from '../../common/orchestrator/AbstractPipe';
import { PIPE_INSTALLATION_COMPRESSOR_SELECTION } from '../../installation/constants';
import {
  ANALYSIS_INVITE_SCAN_KIT,
  ANALYSIS_USE_KIT_FORM,
  ANALYSIS_FIND_KIT_FORM,
  ANALYSIS_SELECT_NATURE,
} from '../constants';

class OilAnalysisPipe extends AbstractPipe {
  /**
   * @param {ClientPipe} installationClientPipe
   */
  constructor(installationClientPipe) {
    super();

    this.installationClientPipe = installationClientPipe;
  }

  /**
   * {@inheritDoc}
   */
  getStep(state) {
    const { installation, component } = state.installationManagementReducer;
    const { analysis, kit, barcode } = state.analysisPipe;
    if (!installation) {
      return this.installationClientPipe.getStep(state);
    }

    if (!component) {
      return PIPE_INSTALLATION_COMPRESSOR_SELECTION;
    }

    if (!analysis) {
      return ANALYSIS_SELECT_NATURE;
    }

    if ((barcode && !kit) || (kit && kit.used)) {
      return ANALYSIS_FIND_KIT_FORM;
    }

    if (!kit) {
      return ANALYSIS_INVITE_SCAN_KIT;
    }

    return ANALYSIS_USE_KIT_FORM;
  }
}

export default OilAnalysisPipe;
