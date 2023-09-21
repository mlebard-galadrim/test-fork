import I18n from 'i18n-js';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import Leak from '../models/Leak';
import { setSignature, validateIntervention, saveIntervention } from '../actions/interventionPipe';
import { AbstractLeakDetectionSumUp } from './LeakDetectionSumUp';

/**
 * LeakRepairSumUp scene
 */
class LeakRepairSumUp extends AbstractLeakDetectionSumUp {
  static propTypes = {
    ...AbstractLeakDetectionSumUp.propTypes,
  };

  constructor(props) {
    super(props);

    this.translations = I18n.t('scenes.intervention.leak_repair_sum_up');
  }

  /**
   * {@inheritdoc}
   */
  getSubtitle() {
    return null;
  }
}

export default connect(
  state => {
    const { intervention } = state.interventionPipe;
    const installation = get('installation_repository').find(intervention.installation);
    const leaks = intervention.repairedLeaks
      .map(repairedLeak => {
        const leak = installation.leaks.find(leak => leak.uuid === repairedLeak.leakUuid);

        if (!leak) {
          // prevents issues on unmount, when the leak has been removed from the installation
          // to be saved on the intervention:
          return null;
        }

        const { componentUuid, location } = leak;

        return Leak.create(componentUuid, location, true, repairedLeak.leakUuid);
      })
      .filter(Boolean);

    return {
      leaks,
      intervention,
      detector: get('detector_repository').find(state.interventionPipe.intervention.detector),
    };
  },
  dispatch => ({
    validateIntervention: (...args) => dispatch(validateIntervention(...args)),
    saveIntervention: (...args) => dispatch(saveIntervention(...args)),
    setSignature: (...args) => dispatch(setSignature(...args)),
  }),
)(LeakRepairSumUp);
