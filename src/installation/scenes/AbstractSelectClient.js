import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'k2/app/container';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import FiltersList from 'k2/app/modules/installation/components/FiltersList';
import AlphabeticList from 'k2/app/modules/common/components/list/AlphabeticList';
import ClientFilter from 'k2/app/modules/installation/filters/ClientFilter';
import SiteFilter from 'k2/app/modules/installation/filters/SiteFilter';

export default class AbstractSelectClient extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    barcode: PropTypes.bool,
    filter: PropTypes.oneOf(ClientFilter.values),
    selectClient: PropTypes.func.isRequired,
  };

  static defaultProps = {
    barcode: true,
    filter: null,
    selectClient: null,
  };

  static styles = {
    listView: {
      flex: 1,
    },
  };

  constructor(props) {
    super(props);

    this.clientRepository = get('client_repository');

    this.onPressClient = this.onPressClient.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  componentWillUnmount() {
    this.props.selectClient(null);
  }

  /**
   * @param {Client} client
   */
  onPressClient(client) {
    const { next, filter, selectClient } = this.props;

    selectClient(client);
    next({ filter: SiteFilter.mask(filter) });
  }

  renderFilters() {
    const { barcode, filter } = this.props;

    return (
      <FiltersList
        key="filters"
        next={this.props.next}
        barcode={barcode && ClientFilter.hasInstallation(filter)}
        geoloc={ClientFilter.hasAddress(filter)}
        filter={filter}
      />
    );
  }

  renderList(clients) {
    const { styles } = this.constructor;

    return (
      <AlphabeticList
        key="list"
        style={styles.listView}
        data={clients}
        onPressItem={this.onPressClient}
        renderContent={client => client.name}
        getSectionId={client => client.name}
      />
    );
  }

  renderChildren(clients) {
    return [this.renderFilters(), this.renderList(clients)];
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { filter } = this.props;
    const clients = Array.from(this.clientRepository.findForFilter(filter).sorted('name'));

    return (
      <WrapperView full title={I18n.t('scenes.installation.client.title')}>
        {this.renderChildren(clients)}
      </WrapperView>
    );
  }
}
