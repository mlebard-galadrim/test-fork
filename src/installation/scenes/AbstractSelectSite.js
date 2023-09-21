import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'k2/app/container';
import Client from '../models/Client';
import WrapperView from '../../common/components/WrapperView';
import MainListView from '../../common/components/list/MainListView';
import SiteFilter from '../filters/SiteFilter';
import InstallationFilter from '../filters/InstallationFilter';

/**
 * Site scene
 */
export default class AbstractSelectSite extends Component {
  static propTypes = {
    selectSite: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
    client: PropTypes.instanceOf(Client).isRequired,
    filter: PropTypes.oneOf(SiteFilter.values),
  };

  static defaultProps = {
    filter: null,
  };

  static styles = {
    listView: {
      flex: 1,
    },
  };

  constructor(props) {
    super(props);

    this.onPressSite = this.onPressSite.bind(this);

    this.siteRepository = get('site_repository');
  }

  /**
   * {@inheritdoc}
   */
  componentWillUnmount() {
    this.props.selectSite(null);
  }

  /**
   * @param {SiteModel} site
   */
  onPressSite(site) {
    const { filter, next, selectSite } = this.props;

    selectSite(site);
    next({ filter: InstallationFilter.mask(filter), selectedSite: site });
  }

  renderChildren(sites) {
    const { styles } = this.constructor;
    const { filter } = this.props;

    return (
      <MainListView
        key="list"
        data={sites}
        style={styles.listView}
        onPressItem={this.onPressSite}
        getSectionId={site => (filter === SiteFilter.MOBILE ? site.name : site.city)}
        renderContent={site => site.name}
      />
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { client, filter } = this.props;
    const sites = Array.from(this.siteRepository.findByClientForFilter(client, filter));

    return (
      <WrapperView full title={I18n.t('scenes.installation.site.title')} subtitle={client.name}>
        {this.renderChildren(sites)}
      </WrapperView>
    );
  }
}
