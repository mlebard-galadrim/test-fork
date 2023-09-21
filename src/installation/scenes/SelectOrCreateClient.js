import I18n from 'i18n-js';
import React from 'react';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import { Button } from 'k2/app/modules/common/components/form';
import { PIPE_INSTALLATION_MANAGEMENT_CREATE_CLIENT } from '../constants';
import { selectClient } from 'k2/app/modules/installation/actions/installationPipe';
import AbstractSelectClient from './AbstractSelectClient';

class SelectOrCreateClient extends AbstractSelectClient {
  static styles = {
    ...AbstractSelectClient.styles,
    full: {
      marginLeft: -10,
      marginRight: -10,
    },
  };

  constructor(props) {
    super(props);

    this.onCreateClient = this.onCreateClient.bind(this);
  }

  onCreateClient() {
    const { next } = this.props;

    navigate(PIPE_INSTALLATION_MANAGEMENT_CREATE_CLIENT, { next });

    get('firebase-analytics').logEvent('client_create_click');
  }

  /**
   * {@inheritdoc}
   */
  renderChildren(clients) {
    const { styles } = this.constructor;

    return super.renderChildren(clients).concat([
      <Button key="add" onPress={this.onCreateClient} style={styles.full}>
        {I18n.t('scenes.installation.client.createClient')}
      </Button>,
    ]);
  }
}

export default connect(
  (state, props) => ({
    filter: props.navigation.getParam('filter'),
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    selectClient: client => dispatch(selectClient(client)),
  }),
)(SelectOrCreateClient);
