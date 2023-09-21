import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import InstallationForm from './InstallationForm';
import Site from '../models/Site';
import { saveNewInstallation } from '../actions/installationManagementActions';
import Purpose from '../../intervention/models/Purpose';
import { PIPE_ASSEMBLY_SUMUP, PIPE_DISASSEMBLY_SUMUP } from '../../intervention/constants';
import { PIPE_INSTALLATION_MANAGEMENT_INFO } from '../constants';
import InterventionType from '../../intervention/models/InterventionType';
import { createIntervention } from '../../intervention/actions/interventionPipe';
import { navigate } from 'k2/app/navigation';

class CreateInstallation extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    createIntervention: PropTypes.func.isRequired,
    site: PropTypes.instanceOf(Site).isRequired,
  };

  constructor(props) {
    super(props);

    this.validator = get('validator');

    this.onValidate = this.onValidate.bind(this);
    this.onCreateIntervention = this.onCreateIntervention.bind(this);
    this.createIntervention = this.createIntervention.bind(this);
  }

  /**
   * Create installation if has sufficient information
   */
  onValidate(installation, callback = null) {
    const { next, site, save } = this.props;

    this.validator.validate(this.validator.isInstallationUnique(site, installation), () => {
      save({ ...installation, site });
      navigate(PIPE_INSTALLATION_MANAGEMENT_INFO, { next: () => {} }, 'replace');
      callback ? callback() : next(undefined, 'replace');
    });
  }

  createIntervention(installation, type, purpose, performedAt) {
    this.props.createIntervention(type, installation.id, purpose, performedAt);

    this.validator.validate(this.validator.isInstallationValid(installation), () => {
      navigate(type === InterventionType.ASSEMBLY ? PIPE_ASSEMBLY_SUMUP : PIPE_DISASSEMBLY_SUMUP);
    });
  }

  onCreateIntervention(data, type) {
    const interventionAtField = type === InterventionType.ASSEMBLY ? 'assemblyAt' : 'disassemblyAt';
    const { [interventionAtField]: performedAt, ...rest } = data;
    const purpose = type === InterventionType.ASSEMBLY ? Purpose.ASSEMBLY : Purpose.DISASSEMBLY;

    const installation = { ...rest, assemblyAt: null, disassemblyAt: null };

    this.onValidate(data, () => {
      this.createIntervention(installation, type, purpose, performedAt);
    });
  }

  /**
   * {@inheritdoc}
   */
  render() {
    return (
      <WrapperView scrollable keyboardAware full title={I18n.t('scenes.installation.installation.createInstallation')}>
        <InstallationForm onValidate={this.onValidate} onCreateIntervention={this.onCreateIntervention} />
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    site: state.installationPipe.site,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    save: data => dispatch(saveNewInstallation(data)),
    createIntervention: (target, installation, purpose, performedAt) =>
      dispatch(createIntervention(target, installation, purpose, null, performedAt)),
  }),
)(CreateInstallation);
