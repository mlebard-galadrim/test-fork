import I18n from 'i18n-js';
import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'k2/app/container';
import AbstractSumUp from 'k2/app/modules/common/scenes/AbstractSumUp';
import Definition from 'k2/app/modules/common/components/Definition';
import Intervention from '../models/Intervention';
import Purpose from '../models/Purpose';
import InterventionTransitionModal from 'k2/app/modules/intervention/components/InterventionTransitionModal';
import { localize, trans } from 'k2/app/I18n';
import DatePicker from 'k2/app/modules/ui/components/DatePicker';
import { padding } from 'k2/app/modules/common/styles/utils';

/**
 * Intervention SumUp scene
 */
class InterventionSumUp extends AbstractSumUp {
  static propTypes = {
    ...AbstractSumUp.propTypes,
    validateIntervention: PropTypes.func.isRequired,
    saveIntervention: PropTypes.func.isRequired,
    setSignature: PropTypes.func.isRequired,
    intervention: PropTypes.instanceOf(Intervention).isRequired,
  };

  constructor(props) {
    super(props, 'scenes.intervention', props.intervention.type);

    const { intervention } = props;

    this.validator = get('validator');

    this.state = {
      ...this.state,
      record: intervention.record,
      performedAt: intervention.performedAt,
      observations: intervention.observations,
      installation: get('installation_repository').find(intervention.installation),
    };
  }

  /**
   * @inheritdoc
   */
  onValidate() {
    const { validateIntervention, saveIntervention } = this.props;
    const { observations, record, performedAt } = this.state;

    if (!this.isComplete()) {
      return;
    }

    validateIntervention(record, observations, performedAt);
    saveIntervention();

    this.setState({ showConfirmModal: true });
  }

  /**
   * @inheritdoc
   */
  onSignature(signature, name) {
    this.props.setSignature(signature, name);
  }

  /**
   * @inheritdoc
   */
  isComplete() {
    return this.validator.isInterventionComplete();
  }

  /**
   * @inheritdoc
   */
  getInfos() {
    const { installation } = this.state;

    return [
      <Definition
        key="client"
        label={I18n.t('scenes.intervention.sum_up.client')}
        value={installation.site.client.name}
      />,
      <Definition key="site" label={I18n.t('scenes.intervention.sum_up.site')} value={installation.site.name} />,
      <Definition
        key="installation"
        label={I18n.t('scenes.intervention.sum_up.installation')}
        value={installation.name}
      />,
    ];
  }

  /**
   * @inheritdoc
   */
  getSignatures() {
    return [
      this.renderSignature(I18n.t('scenes.intervention.sum_up.operator_sign'), 'operator'),
      this.renderSignature(I18n.t('scenes.intervention.sum_up.client_sign'), 'client'),
    ];
  }

  /**
   * @inheritdoc
   */
  getTitle() {
    return I18n.t('scenes.intervention.sum_up.title');
  }

  /**
   * @inheritdoc
   */
  getSubtitle() {
    return I18n.t(Purpose.readableFor(this.props.intervention.purpose));
  }

  renderPerformedAt() {
    const { intervention } = this.props;

    return (
      <DatePicker
        label={trans('scenes.intervention.sum_up.performed_at')}
        date={this.state.performedAt}
        onChange={date => this.setState({ performedAt: date })}
        placeholder={localize('date.formats.short', intervention.creation)}
        allowClear
        style={{
          ...AbstractSumUp.styles.record.container,
          ...padding(5, 8),
        }}
        labelStyle={AbstractSumUp.styles.record.label}
        inputContainerStyle={AbstractSumUp.styles.record.input}
      />
    );
  }

  renderTransitionModal(visible) {
    const { installation } = this.state;
    const { intervention } = this.props;

    return (
      <InterventionTransitionModal
        visible={visible}
        title={I18n.t(`${this.root}.sum_up_validation.title.${this.type}`)}
        subtitle={I18n.t(`${this.root}.sum_up_validation.subtitle`)}
        icon={this.renderTransitionModalIcon()}
        site={installation.site}
        intervention={intervention}
      />
    );
  }
}

export default InterventionSumUp;
