import I18n from 'i18n-js';
import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { navigate } from 'k2/app/navigation';
import AbstractShunt from './AbstractShunt';
import Leak from '../models/Leak';
import Purpose from '../models/Purpose';
import { GUTTER } from '../../common/styles/vars';
import LeakList from '../components/LeakList';
import { PIPE_LEAK_DETECTION_SUMUP, PIPE_SELECT_LEAKING_COMPONENT } from '../constants';

/**
 * Shunt scene for leak detection shunt interventions
 */
class LeakDetectionShunt extends AbstractShunt {
  static propTypes = {
    next: PropTypes.func.isRequired,
    leaks: PropTypes.arrayOf(PropTypes.instanceOf(Leak)).isRequired,
  };

  static styles = {
    ...AbstractShunt.styles,
    list: {
      flex: 1,
      marginTop: GUTTER * 2,
      marginHorizontal: -GUTTER,
    },
  };

  constructor(props) {
    super(props);

    this.translations = I18n.t('scenes.intervention.leak_detection_shunt');
    this.state = {
      confirmed: false,
    };

    this.onConfirm = this.onConfirm.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    const { leaks } = this.props;

    return (
      leaks.length !== nextProps.leaks.length || nextProps.leaks.some((leak, index) => leak.uuid !== leaks[index].uuid)
    );
  }

  onConfirm() {
    this.setState({ confirmed: true }, this.endIntervention);
  }

  /**
   * Declare a new leak in the intervention
   */
  continueIntervention() {
    const { leaks, next } = this.props;

    navigate(PIPE_SELECT_LEAKING_COMPONENT, { next, index: leaks.length }, 'push');
  }

  /**
   * End of intervention
   */
  endIntervention() {
    const { leaks, next } = this.props;
    const { confirmed } = this.state;

    if (leaks.length === 0 && !confirmed) {
      return Alert.alert(this.translations['confirm:title'], this.translations['confirm:text'], [
        { text: I18n.t('common.cancel'), style: 'cancel' },
        { text: I18n.t('common.confirm'), onPress: this.onConfirm },
      ]);
    }

    this.setState({ confirmed: false });

    return navigate(PIPE_LEAK_DETECTION_SUMUP, { next });
  }

  getContinueLabel() {
    return this.translations[this.props.leaks.length === 0 ? 'add_first_leak' : 'add_leak'];
  }

  getFinishLabel() {
    return this.translations.finish_intervention;
  }

  renderInfos() {
    const { leaks } = this.props;
    const { styles } = this.constructor;

    return <LeakList key="list" style={styles.list} leaks={leaks} />;
  }
}

export default connect((state, props) => ({
  title: I18n.t('scenes.intervention.leak_detection_shunt.list:title'),
  subtitle: I18n.t(Purpose.readableFor(state.interventionPipe.intervention.purpose)),
  leaks: state.interventionPipe.intervention.leaks,
  next: props.navigation.getParam('next'),
}))(LeakDetectionShunt);
