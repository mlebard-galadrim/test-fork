import AbstractPipe from '../../common/orchestrator/AbstractPipe';
import { PIPE_INVITE_SCAN_DETECTOR, PIPE_FIND_DETECTOR_FORM, PIPE_CONFIRM_DETECTOR } from '../constants';

class DetectorPipe extends AbstractPipe {
  /**
   * {@inheritDoc}
   */
  getStep(state) {
    const { detector, barcode } = state.selectDetectorPipe;

    if (detector && !detector.expired) {
      return PIPE_CONFIRM_DETECTOR;
    }

    if (barcode) {
      return PIPE_FIND_DETECTOR_FORM;
    }

    return PIPE_INVITE_SCAN_DETECTOR;
  }
}

export default DetectorPipe;
