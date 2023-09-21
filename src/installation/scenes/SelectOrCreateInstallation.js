import I18n from 'i18n-js';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import { Button } from 'k2/app/modules/common/components/form';
import AbstractSelectInstallation from './AbstractSelectInstallation';
import { selectInstallation } from 'k2/app/modules/installation/actions/installationPipe';
import { PIPE_INSTALLATION_MANAGEMENT_CREATE_INSTALLATION } from '../constants';

class SelectOrCreateInstallation extends AbstractSelectInstallation {
  static propTypes = {
    ...AbstractSelectInstallation.propTypes,
    next: PropTypes.func.isRequired,
  };

  static styles = {
    ...AbstractSelectInstallation.styles,
    full: {
      marginLeft: -10,
      marginRight: -10,
    },
  };

  constructor(props) {
    super(props);

    this.translations = I18n.t('scenes.installation.installation');

    this.onCreateInstallation = this.onCreateInstallation.bind(this);
  }

  onCreateInstallation() {
    const { next } = this.props;

    navigate(PIPE_INSTALLATION_MANAGEMENT_CREATE_INSTALLATION, { next });

    get('firebase-analytics').logEvent('installation_create_click');
  }

  renderButton() {
    return (
      <Button key="add" onPress={this.onCreateInstallation} style={SelectOrCreateInstallation.styles.full}>
        {this.translations.createInstallation}
      </Button>
    );
  }

  /**
   * Render children
   *
   * @return {Array}
   */
  renderChildren() {
    return [super.renderChildren(), this.renderButton()];
  }
}

export default connect(
  ({ installationPipe }, props) => ({
    installations: installationPipe.site
      ? Array.from(
        installationPipe.site.installations.filter(
          installation => !installation.synced || !installation.isDismantled() || !installation.isDeleted,
        ),
      )
      : [],
    siteName: installationPipe.site ? installationPipe.site.name : null,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    selectInstallation: installation => dispatch(selectInstallation(installation)),
  }),
)(SelectOrCreateInstallation);
