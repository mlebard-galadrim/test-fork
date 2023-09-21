import React from 'react';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import { get } from 'k2/app/container';
import { selectSite } from '../actions/installationPipe';
import AbstractSelectSite from './AbstractSelectSite';
import { PIPE_INSTALLATION_MANAGEMENT_CREATE_SITE } from '../constants';
import { navigate } from 'k2/app/navigation';
import { Button } from 'k2/app/modules/common/components/form';

/**
 * Site scene
 */
class SelectOrCreateSite extends AbstractSelectSite {
  constructor(props) {
    super(props);

    this.onCreateSite = this.onCreateSite.bind(this);
  }

  onCreateSite() {
    const { next } = this.props;

    navigate(PIPE_INSTALLATION_MANAGEMENT_CREATE_SITE, { next });

    get('firebase-analytics').logEvent('site_create_click');
  }

  /**
   * {@inheritdoc}
   */
  renderChildren(sites) {
    const { styles } = this.constructor;

    return [
      super.renderChildren(sites),
      <Button key="add" onPress={this.onCreateSite} style={styles.full}>
        {I18n.t('scenes.installation.site.createSite')}
      </Button>,
    ];
  }
}

export default connect(
  (state, props) => ({
    client: state.installationPipe.client,
    filter: props.navigation.getParam('filter'),
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    selectSite: site => dispatch(selectSite(site)),
  }),
)(SelectOrCreateSite);
