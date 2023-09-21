import I18n from 'i18n-js';
import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Text, View } from 'react-native';
import { navigate } from 'k2/app/navigation';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import AbstractShunt from './AbstractShunt';
import ContainerLoad from '../models/ContainerLoad';
import { setMarkAsEmpty, setUpdateNominalLoad } from '../actions/interventionPipe';
import Purpose from '../models/Purpose';
import InterventionType from '../models/InterventionType';
import ContainerLoadList from '../components/ContainerLoadList';
import InstallationGauge from '../components/InstallationGauge';
import { GUTTER, COLOR_UNDERLAY } from 'k2/app/modules/common/styles/vars';
import Option from 'k2/app/modules/common/components/Option';
import { INTERVENTION_INVITE_SCAN_CONTAINER, PIPE_DRAINAGE_FILLING_SUMUP } from '../constants';

/**
 * Snan hunt scene for drainage/filling interventions
 */
class DrainageFillingShunt extends AbstractShunt {
  static propTypes = {
    next: PropTypes.func.isRequired,
    setMarkAsEmpty: PropTypes.func.isRequired,
    containerLoads: PropTypes.arrayOf(PropTypes.instanceOf(ContainerLoad)).isRequired,
  };

  static styles = {
    ...AbstractShunt.styles,
    wrapper: {
      flex: 1,
    },
    icon: {
      marginRight: GUTTER,
    },
    gauge: {
      flex: 1,
    },
    containerList: {
      flex: 1,
      marginTop: GUTTER * 2,
      marginHorizontal: -GUTTER,
      marginBottom: GUTTER,
    },
    details: {
      fontSize: 12,
      color: COLOR_UNDERLAY,
    },
  };

  constructor() {
    super();

    this.validator = get('validator');
  }

  /**
   * Add new container in the intervention
   */
  continueIntervention() {
    const { next } = this.props;

    navigate(INTERVENTION_INVITE_SCAN_CONTAINER, { next }, 'push');
  }

  /**
   * End of intervention
   */
  endIntervention() {
    const { next } = this.props;

    navigate(PIPE_DRAINAGE_FILLING_SUMUP, { next });
  }

  getTitle() {
    const { type, purpose } = this.props;

    return `${type} - ${purpose}`;
  }

  getContinueLabel() {
    return I18n.t('scenes.intervention.drainage_filling_shunt.add_container');
  }

  getFinishLabel() {
    return I18n.t('scenes.intervention.drainage_filling_shunt.finish_intervention');
  }

  /**
   * Set installation as empty in the intervention
   *
   * @return {Element|null}
   */
  renderMarkAsEmpty() {
    const { styles } = this.constructor;
    const { interventionType, markAsEmpty } = this.props;

    if (interventionType !== InterventionType.DRAINAGE || !this.validator.mayDrainageInterventionIsEmpty()) {
      return null;
    }

    return (
      <View style={styles.option}>
        <Text style={styles.optionText}>{I18n.t('scenes.intervention.drainage_filling_shunt.mark_as_empty')}</Text>
        <Switch
          style={styles.optionSwitch}
          trackColor="#AAA"
          value={markAsEmpty}
          onValueChange={this.props.setMarkAsEmpty}
        />
      </View>
    );
  }

  /**
   * Update installation nominal load in the intervention
   *
   * @return {Element|null}
   */
  renderUpdateNominalLoad() {
    const { interventionType, updateNominalLoad } = this.props;

    if (interventionType !== InterventionType.FILLING || !this.validator.mayFillingInterventionUpdateNominalLoad()) {
      return null;
    }

    return (
      <Option label={I18n.t('scenes.intervention.drainage_filling_shunt.update_nominal_load')}>
        <Switch trackColor="#AAA" value={updateNominalLoad} onValueChange={this.props.setUpdateNominalLoad} />
      </Option>
    );
  }

  renderInfos() {
    const { styles } = this.constructor;
    const { containerLoads, interventionType } = this.props;

    return (
      <View style={styles.wrapper}>
        <InstallationGauge style={styles.gauge} />
        <ContainerLoadList
          containerLoads={containerLoads}
          loading={interventionType === InterventionType.FILLING}
          style={styles.containerList}
          installation={this.props.installation}
        />
        {this.renderMarkAsEmpty()}
        {this.renderUpdateNominalLoad()}
      </View>
    );
  }
}

export default connect(
  (state, props) => ({
    title: I18n.t('scenes.intervention.drainage_filling_shunt.installation_state:title'),
    subtitle: I18n.t(Purpose.readableFor(state.interventionPipe.intervention.purpose)),
    interventionType: state.interventionPipe.intervention.type,
    containerLoads: state.interventionPipe.intervention.containerLoads,
    installation: state.interventionPipe.intervention.installation,
    markAsEmpty: state.interventionPipe.intervention.markAsEmpty,
    updateNominalLoad: state.interventionPipe.intervention.updateNominalLoad,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    setMarkAsEmpty: value => dispatch(setMarkAsEmpty(value)),
    setUpdateNominalLoad: value => dispatch(setUpdateNominalLoad(value)),
  }),
)(DrainageFillingShunt);
