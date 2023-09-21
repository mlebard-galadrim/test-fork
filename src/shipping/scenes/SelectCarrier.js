import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import MainListView from 'k2/app/modules/common/components/list/MainListView';
import { Button } from 'k2/app/modules/common/components/form';
import { selectCarrier, cancelCarrierSelection } from '../actions/shippingPipe';
import { alphabetically } from 'k2/app/modules/common/utils/filterUtils';
import Container from '../../container/models/Container';

class SelectCarrier extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    selectCarrier: PropTypes.func.isRequired,
    cancelCarrierSelection: PropTypes.func.isRequired,
    shippingContainers: PropTypes.arrayOf(PropTypes.instanceOf(Container)).isRequired,
  };

  static styles = {
    listView: {
      flex: 1,
    },
    noCarrierButton: {
      flex: 0,
      borderRadius: 0,
    },
  };

  constructor(props) {
    super(props);
    this.unavailabilityRepository = get('unavailability_repository');

    this.onPress = this.onPress.bind(this);

    const shouldFilterExpiredCarriers = this.computeHasFilledDrainageContainer();

    const allCarriers = Array.from(get('carrier_repository').findAll());

    const today = new Date();

    const carriers = !shouldFilterExpiredCarriers
      ? allCarriers
      : allCarriers.filter(carrier => {
        return carrier.transportAuthorizationExpirationDate > today;
      });

    this.state = {
      carriers: carriers,
    };
  }

  // We want to filter carriers with an expired authorization only when:
  // - There is at least one container that allows for drainage
  // AND
  // - One of those containers is not empty
  computeHasFilledDrainageContainer() {
    const { shippingContainers } = this.props;

    const hasFilledContainerForDrainage = shippingContainers.find(container => {
      return (
        this.unavailabilityRepository.isAvailableForRecupOrTransfer(container.article.uuid) &&
        container.getCurrentLoad() > 0
      );
    });
    return !!hasFilledContainerForDrainage;
  }

  componentWillUnmount() {
    this.props.cancelCarrierSelection();
  }

  /**
   * @param {Carrier|null} carrier Carrier instance or null if not provided
   */
  onPress(carrier = null) {
    this.props.selectCarrier(carrier);
    this.props.next();
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { carriers } = this.state;
    const renderCarrierLabel = carrier => carrier.name;

    return (
      <WrapperView title={I18n.t('scenes.shipping.select_carrier.title')} full>
        <MainListView
          style={styles.listView}
          data={carriers}
          onPressItem={this.onPress}
          renderContent={renderCarrierLabel}
          getSectionId={carrier => carrier.city}
          sorter={(a, b) => alphabetically(renderCarrierLabel(a), renderCarrierLabel(b))}
          icon={null}
        />
        <Button onPress={() => this.onPress(null)} style={styles.noCarrierButton}>
          {I18n.t('scenes.shipping.select_carrier.no_selection')}
        </Button>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    next: props.navigation.getParam('next'),
    shippingContainers: state.shippingReducer.shippingContainers,
  }),
  dispatch => ({
    selectCarrier: carrier => dispatch(selectCarrier(carrier)),
    cancelCarrierSelection: () => dispatch(cancelCarrierSelection()),
  }),
)(SelectCarrier);
