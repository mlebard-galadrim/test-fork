import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import SiteForm from './SiteForm';
import Client from '../models/Client';
import { saveNewSite } from '../actions/installationManagementActions';

class CreateSite extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    client: PropTypes.instanceOf(Client).isRequired,
  };

  constructor(props) {
    super(props);

    this.validator = get('validator');

    this.onValidate = this.onValidate.bind(this);
  }

  /**
   * Create site if has sufficient information
   */
  onValidate(site) {
    const { next, client, save } = this.props;

    save({ ...site, client });
    next(undefined, 'replace');
  }

  /**
   * {@inheritdoc}
   */
  render() {
    return (
      <WrapperView scrollable keyboardAware full title={I18n.t('scenes.installation.site.createSite')}>
        <SiteForm onValidate={this.onValidate} />
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    client: state.installationPipe.client,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    save: data => dispatch(saveNewSite(data)),
  }),
)(CreateSite);
