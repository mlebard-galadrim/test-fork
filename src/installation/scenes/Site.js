import I18n from 'i18n-js';
import React from 'react';
import { connect } from 'react-redux';
import { selectSite } from '../actions/installationPipe';
import HelperBox from '../../common/components/HelperBox';
import SiteFilter from '../filters/SiteFilter';
import AbstractSelectSite from './AbstractSelectSite';

/**
 * Site scene
 */
class Site extends AbstractSelectSite {
  /**
   * {@inheritdoc}
   */
  renderChildren(sites) {
    const { filter, client } = this.props;

    if (!SiteFilter.isExcluding(filter)) {
      return super.renderChildren(sites);
    }

    const total = this.siteRepository.findForClient(client).length;
    const count = sites.length;

    return [
      super.renderChildren(sites),
      // Shows appropriate help box according to active filters:
      filter === SiteFilter.WITH_INSTALLATION ? (
        <HelperBox
          key="helper"
          title={I18n.t('scenes.installation.site.sites_shown_info', {
            count,
            total,
          })}
          content={I18n.t(`scenes.installation.site.modal:info${filter === SiteFilter.LEAKING ? ':leak' : ''}`)}
        />
      ) : null,
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
)(Site);
