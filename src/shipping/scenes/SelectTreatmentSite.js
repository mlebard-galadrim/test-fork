import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import WrapperView from '../../common/components/WrapperView';
import MainListView from '../../common/components/list/MainListView';
import { selectTreatmentSite, cancelTreatmentSiteSelection } from '../actions/shippingPipe';
import Client from 'k2/app/modules/installation/models/Client';
import { alphabetically } from 'k2/app/modules/common/utils/filterUtils';

class SelectTreatmentSite extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    selectTreatmentSite: PropTypes.func.isRequired,
    cancelTreatmentSiteSelection: PropTypes.func.isRequired,
    /**
     * A pre selected client filters out the list of available sites to only show sites owned by it.
     */
    preSelectedClient: PropTypes.instanceOf(Client),
  };

  static defaultProps = {
    preSelectedClient: null,
  };

  static styles = {};

  constructor(props) {
    super(props);

    this.state = {
      treatmentSites: Array.from(
        get('site_repository').findAllTreatmentSite(['city', 'name'], props.preSelectedClient),
      ),
    };

    this.onPress = this.onPress.bind(this);
  }

  componentWillUnmount() {
    this.props.cancelTreatmentSiteSelection();
  }

  /**
   * @param {Site} treatmentSite
   */
  onPress(treatmentSite = null) {
    this.props.selectTreatmentSite(treatmentSite);
    this.props.next();
  }

  /*
   * {@inheritdoc}
   */
  render() {
    const { treatmentSites } = this.state;
    const renderSiteLabel = treatmentSite => `${treatmentSite.client.name} - ${treatmentSite.name}`;

    return (
      <WrapperView title={I18n.t('scenes.shipping.select_treatment_site.title')} full>
        <MainListView
          data={treatmentSites}
          onPressItem={this.onPress}
          renderContent={renderSiteLabel}
          getSectionId={treatmentSite => treatmentSite.city}
          sorter={(a, b) => alphabetically(renderSiteLabel(a), renderSiteLabel(b))}
          icon=""
        />
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    next: props.navigation.getParam('next'),
    preSelectedClient: props.navigation.getParam('preSelectedClient'),
  }),
  dispatch => ({
    selectTreatmentSite: site => dispatch(selectTreatmentSite(site)),
    cancelTreatmentSiteSelection: () => dispatch(cancelTreatmentSiteSelection()),
  }),
)(SelectTreatmentSite);
