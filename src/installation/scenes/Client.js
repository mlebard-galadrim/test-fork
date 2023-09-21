import I18n from 'i18n-js';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import HelperBox from 'k2/app/modules/common/components/HelperBox';
import ClientFilter from 'k2/app/modules/installation/filters/ClientFilter';
import { selectClient, selectInstallation } from 'k2/app/modules/installation/actions/installationPipe';
import PreviousInstallationBanner from 'k2/app/modules/installation/components/PreviousInstallationBanner';
import AbstractSelectClient from './AbstractSelectClient';

class Client extends AbstractSelectClient {
  static propTypes = {
    ...AbstractSelectClient.propTypes,
    previousInstallation: PropTypes.string,
    suggestPreviousInstallation: PropTypes.bool,
    selectInstallation: PropTypes.func.isRequired,
  };

  static defaultProps = {
    ...AbstractSelectClient.defaultProps,
    previousInstallation: null,
    suggestPreviousInstallation: false,
  };

  static styles = {
    ...AbstractSelectClient.styles,
    previousInstallation: {
      marginTop: -20,
    },
  };

  constructor(props) {
    super(props);

    this.installationRepository = get('installation_repository');
    this.validator = get('validator');
    this.analytics = get('firebase-analytics');

    this.selectPreviousInstallation = this.selectPreviousInstallation.bind(this);
  }

  /**
   * @return {String}
   */
  getLabelFilterHelper() {
    const { filter } = this.props;

    if (filter === ClientFilter.LEAKING) {
      return ':leak';
    }

    if (ClientFilter.isSiteOnly(filter)) {
      return ':site_only';
    }

    return '';
  }

  selectPreviousInstallation() {
    const { next, previousInstallation } = this.props;
    const installation = this.installationRepository.find(previousInstallation);

    this.analytics.logEvent('client_previous_installation');

    this.validator.validate(this.validator.isInstallationValid(installation), () => {
      this.props.selectInstallation(installation);
      next();
    });
  }

  renderBanner(clients) {
    const { styles } = this.constructor;
    const { suggestPreviousInstallation, previousInstallation } = this.props;

    if (!suggestPreviousInstallation || !previousInstallation) {
      return null;
    }

    const installation = this.installationRepository.find(previousInstallation);

    if (!installation || !clients.some(client => client.id === installation.site.client.id)) {
      return null;
    }

    return (
      <PreviousInstallationBanner
        key="banner"
        style={styles.previousInstallation}
        onPress={this.selectPreviousInstallation}
        installation={installation}
      />
    );
  }

  renderHelperBox(clients) {
    const { filter } = this.props;
    const total = ClientFilter.isExcluding(filter) ? this.clientRepository.findAll().length : 0;

    if (total < 1) {
      return null;
    }

    return (
      <HelperBox
        key="help"
        title={I18n.t('scenes.installation.client.clients_shown_info', {
          count: clients.length,
          total,
        })}
        content={I18n.t(`scenes.installation.client.modal:info${this.getLabelFilterHelper()}`)}
      />
    );
  }

  /**
   * {@inheritdoc}
   */
  renderChildren(clients) {
    return [this.renderFilters(), this.renderBanner(clients), this.renderList(clients), this.renderHelperBox(clients)];
  }
}

export default connect(
  (state, props) => ({
    previousInstallation: state.installationPipe.previousInstallation,
    suggestPreviousInstallation: props.navigation.getParam('suggestPreviousInstallation'),
    filter: props.navigation.getParam('filter'),
    next: props.navigation.getParam('next'),
    barcode: props.navigation.getParam('barcode'),
  }),
  dispatch => ({
    selectClient: client => dispatch(selectClient(client)),
    selectInstallation: installation => dispatch(selectInstallation(installation)),
  }),
)(Client);
