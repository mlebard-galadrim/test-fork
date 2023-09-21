import I18n from 'i18n-js';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import { setSignature, validateIntervention, saveIntervention } from '../actions/interventionPipe';
import InterventionSumUp from './InterventionSumUp';

/**
 * AssemblySumUp scene
 */
class AssemblySumUp extends InterventionSumUp {
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

  /**
   * {@inheritdoc}
   */
  renderContent() {
    return null;
  }
}

export default connect(
  state => {
    const { intervention } = state.interventionPipe;
    const installation = get('installation_repository').find(intervention.installation);

    return {
      installation,
      intervention,
    };
  },
  dispatch => ({
    validateIntervention: (...args) => dispatch(validateIntervention(...args)),
    saveIntervention: (...args) => dispatch(saveIntervention(...args)),
    setSignature: (...args) => dispatch(setSignature(...args)),
  }),
)(AssemblySumUp);
