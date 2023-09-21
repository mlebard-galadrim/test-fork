import I18n from 'i18n-js';
import React from 'react';
import { connect } from 'react-redux';
import { View, Text, Switch as RNSwitch } from 'react-native';
import Definition from 'k2/app/modules/common/components/Definition';
import {
  setSignature,
  validateIntervention,
  saveIntervention,
  saveShouldCreateBsff,
} from '../actions/interventionPipe';
import InterventionSumUp from './InterventionSumUp';
import InterventionType from '../models/InterventionType';
import ContainerLoadList from '../components/ContainerLoadList';
import CompanyCountry from '../../installation/models/CompanyCountry';

/**
 * DrainageFillingSumUp scene
 */
class DrainageFillingSumUp extends InterventionSumUp {
  componentDidMount() {
    const { usesTrackdechets } = this.props;

    this.props.saveShouldCreateBsff(usesTrackdechets);
  }

  renderShouldCreateBsff() {
    const { usesTrackdechets } = this.props;
    const { shouldCreateBsffFiche } = this.props.intervention;
    const { styles } = this.constructor;
    const textStyles = { flexShrink: 1, paddingVertical: 5 };

    if (!usesTrackdechets) {
      return null;
    }

    return (
      <View style={styles.wrapper}>
        <Text style={textStyles}>{I18n.t('scenes.intervention.sum_up.emit_bsff')}</Text>

        <RNSwitch
          onValueChange={() => this.props.saveShouldCreateBsff(!shouldCreateBsffFiche)}
          value={shouldCreateBsffFiche}
        />
      </View>
    );
  }
  /**
   * {@inheritdoc}
   */
  renderContent() {
    const { styles } = this.constructor;
    const { containerLoads, type, markAsEmpty, updateNominalLoad } = this.props.intervention;

    return (
      <View style={styles.fieldset}>
        {markAsEmpty && (
          <Definition
            key="empty-installation"
            label={I18n.t('scenes.intervention.sum_up.empty_installation:label')}
            value={I18n.t('scenes.intervention.sum_up.empty_installation:value')}
          />
        )}
        {updateNominalLoad && (
          <Definition
            key="updateNominalLoad-installation"
            label={I18n.t('scenes.intervention.sum_up.update_nominal_load:label')}
            value={I18n.t('scenes.intervention.sum_up.update_nominal_load:value')}
          />
        )}
        <Text style={styles.label}>{I18n.t('scenes.intervention.sum_up.containers')}</Text>
        <ContainerLoadList
          style={{ ...styles.fullWidth, ...styles.contentList }}
          containerLoads={containerLoads}
          loading={type === InterventionType.FILLING}
          installation={this.props.installation}
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    intervention: state.interventionPipe.intervention,
    installation: state.interventionPipe.intervention.installation,
    usesTrackdechets: new CompanyCountry(state.authentication.userProfile.companyCountry).usesTrackdechets(),
  }),
  dispatch => ({
    saveShouldCreateBsff: shouldCreateBsff => dispatch(saveShouldCreateBsff(shouldCreateBsff)),
    validateIntervention: (...args) => dispatch(validateIntervention(...args)),
    saveIntervention: (...args) => dispatch(saveIntervention(...args)),
    setSignature: (...args) => dispatch(setSignature(...args)),
  }),
)(DrainageFillingSumUp);
