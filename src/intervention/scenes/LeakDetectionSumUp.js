import I18n from 'i18n-js';
import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import Definition from 'k2/app/modules/common/components/Definition';
import { setSignature, validateIntervention, saveIntervention } from '../actions/interventionPipe';
import Detector from 'k2/app/modules/detector/models/Detector';
import Leak from '../models/Leak';
import LeakList from '../components/LeakList';
import InterventionSumUp from './InterventionSumUp';

/**
 * LeakDetectionSumUp scene
 */
class LeakDetectionSumUp extends InterventionSumUp {
  static propTypes = {
    ...InterventionSumUp.propTypes,
    detector: PropTypes.instanceOf(Detector).isRequired,
    leaks: PropTypes.arrayOf(PropTypes.instanceOf(Leak)).isRequired,
  };

  constructor(props) {
    super(props);

    this.translations = I18n.t('scenes.intervention.leak_detection_sum_up');
  }

  getInfos() {
    const { detector } = this.props;

    return super
      .getInfos()
      .concat([
        <Definition
          key="detector"
          testID="detector-ref"
          label={this.translations['detector:caption']}
          value={detector.designation || detector.barcode || detector.serialNumber}
        />,
      ]);
  }

  /**
   * {@inheritdoc}
   */
  renderContent() {
    const { styles } = this.constructor;
    const { leaks } = this.props;

    return (
      <View style={styles.fieldset}>
        <Text style={styles.label}>{this.translations['leaks:caption']}</Text>
        <LeakList
          style={{ ...styles.fullWidth, ...styles.contentList }}
          leaks={leaks}
          noDataContent={<Text>{this.translations['leaks:none']}</Text>}
        />
      </View>
    );
  }
}

export const AbstractLeakDetectionSumUp = LeakDetectionSumUp;

export default connect(
  state => ({
    intervention: state.interventionPipe.intervention,
    leaks: Array.from(state.interventionPipe.intervention.leaks),
    detector: get('detector_repository').find(state.interventionPipe.intervention.detector),
  }),
  dispatch => ({
    validateIntervention: (...args) => dispatch(validateIntervention(...args)),
    saveIntervention: (...args) => dispatch(saveIntervention(...args)),
    setSignature: (...args) => dispatch(setSignature(...args)),
  }),
)(LeakDetectionSumUp);
