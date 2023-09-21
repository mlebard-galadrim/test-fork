import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Alert } from 'react-native';
import { get } from 'k2/app/container';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import ClientForm from './ClientForm';
import { saveNewClient } from '../actions/installationManagementActions';
import CompanyCountry from 'k2/app/modules/installation/models/CompanyCountry';

class CreateClient extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.validator = get('validator');

    this.onValidate = this.onValidate.bind(this);
  }

  componentDidMount() {
    Alert.alert(
      I18n.t('scenes.installation.client.create_modal.title'),
      I18n.t('scenes.installation.client.create_modal.content'),
    );
  }

  /**
   * Create client if has sufficient information
   */
  onValidate(client) {
    const { next, save } = this.props;

    save(client);
    next(undefined, 'replace');
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const country = new CompanyCountry(this.props.companyCountry);

    return (
      <WrapperView scrollable keyboardAware full title={I18n.t('scenes.installation.client.createClient')}>
        <ClientForm
          onValidate={this.onValidate}
          allowsIndividual={country.allowsIndividual()}
          needsSiret={country.needsSiret()}
          needsVatCode={country.needsVatCode()}
          canUseVatCode={country.canUseVatCode()}
        />
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    next: props.navigation.getParam('next'),
    companyCountry: state.authentication.userProfile.companyCountry,
  }),
  dispatch => ({
    save: data => dispatch(saveNewClient(data)),
  }),
)(CreateClient);
