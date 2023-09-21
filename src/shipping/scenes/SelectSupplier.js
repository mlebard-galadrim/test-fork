import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import WrapperView from '../../common/components/WrapperView';
import MainListView from '../../common/components/list/MainListView';
import { selectSupplier, cancelSupplierSelection } from '../actions/shippingPipe';
import Client from 'k2/app/modules/installation/models/Client';
import { alphabetically } from 'k2/app/modules/common/utils/filterUtils';

class SelectSupplier extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    selectSupplier: PropTypes.func.isRequired,
    cancelSupplierSelection: PropTypes.func.isRequired,
    /**
     * A pre selected client filters out the list of available sites to only show sites owned by it.
     */
    preSelectedClient: PropTypes.instanceOf(Client),
  };

  static styles = {};

  constructor(props) {
    super(props);

    this.state = {
      suppliers: Array.from(
        get('site_repository').findSuppliersAndDistributors(['city', 'name'], props.preSelectedClient),
      ),
    };

    this.onPress = this.onPress.bind(this);
  }

  componentWillUnmount() {
    this.props.cancelSupplierSelection();
  }

  /**
   * @param {Site} supplier
   */
  onPress(supplier = null) {
    this.props.selectSupplier(supplier);
    this.props.next();
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { suppliers } = this.state;
    const renderSupplierLabel = supplier => `${supplier.client.name} - ${supplier.name}`;

    return (
      <WrapperView title={I18n.t('scenes.shipping.select_supplier.title')} full>
        <MainListView
          data={suppliers}
          onPressItem={this.onPress}
          renderContent={renderSupplierLabel}
          getSectionId={supplier => supplier.city}
          sorter={(a, b) => alphabetically(renderSupplierLabel(a), renderSupplierLabel(b))}
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
    selectSupplier: suplier => dispatch(selectSupplier(suplier)),
    cancelSupplierSelection: () => dispatch(cancelSupplierSelection()),
  }),
)(SelectSupplier);
