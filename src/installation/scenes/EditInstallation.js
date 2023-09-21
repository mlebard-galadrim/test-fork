import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { pop } from 'k2/app/navigation';
import { get } from 'k2/app/container';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { saveInstallation } from '../actions/installationManagementActions';
import Site from '../models/Site';
import Installation from '../models/Installation';
import InstallationForm from './InstallationForm';
import { createIntervention } from 'k2/app/modules/intervention/actions/interventionPipe';
import InterventionType from '../../intervention/models/InterventionType';
import Purpose from '../../intervention/models/Purpose';
import { navigate } from 'k2/app/navigation';
import { PIPE_ASSEMBLY_SUMUP, PIPE_DISASSEMBLY_SUMUP } from '../../intervention/constants';

class EditInstallation extends Component {
  static propTypes = {
    saveInstallation: PropTypes.func.isRequired,
    site: PropTypes.instanceOf(Site).isRequired,
    installation: PropTypes.instanceOf(Installation).isRequired,
  };

  constructor(props) {
    super(props);

    this.validator = get('validator');

    this.onValidateInstallation = this.onValidateInstallation.bind(this);
    this.onCreateIntervention = this.onCreateIntervention.bind(this);
    this.createIntervention = this.createIntervention.bind(this);
  }

  /**
   * Edit installation if has sufficient information
   */
  onValidateInstallation(data, callback = pop) {
    const { site, installation } = this.props;

    this.validator.validate(
      [
        this.validator.isInstallationUnique(site, data, installation),
        this.validator.canInstallationBeUpdated(installation, data),
      ],
      () => {
        this.props.saveInstallation({ ...data, id: installation.id });
        callback();
      },
    );
  }

  createIntervention(installation, type, purpose, performedAt) {
    this.props.createIntervention(type, installation.id, purpose, performedAt);

    this.validator.validate(this.validator.isInstallationValid(installation), () => {
      navigate(type === InterventionType.ASSEMBLY ? PIPE_ASSEMBLY_SUMUP : PIPE_DISASSEMBLY_SUMUP);
    });
  }

  onCreateIntervention(data, type) {
    const { installation } = this.props;

    const interventionAtField = type === InterventionType.ASSEMBLY ? 'assemblyAt' : 'disassemblyAt';
    const { [interventionAtField]: performedAt, ...rest } = data;
    const purpose = type === InterventionType.ASSEMBLY ? Purpose.ASSEMBLY : Purpose.DISASSEMBLY;

    this.onValidateInstallation(rest, () => {
      this.createIntervention(installation, type, purpose, performedAt);
    });
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { installation } = this.props;

    return (
      <WrapperView scrollable keyboardAware full title={I18n.t('scenes.installation.installation.editInstallation')}>
        <InstallationForm
          installation={installation}
          onValidate={this.onValidateInstallation}
          onCreateIntervention={this.onCreateIntervention}
        />
      </WrapperView>
    );
  }
}

export default connect(
  state => ({
    site: state.installationPipe.site,
    installation: state.installationManagementReducer.installation,
  }),
  dispatch => ({
    saveInstallation: data => dispatch(saveInstallation(data)),
    createIntervention: (target, installation, purpose, performedAt) =>
      dispatch(createIntervention(target, installation, purpose, null, performedAt)),
  }),
)(EditInstallation);
