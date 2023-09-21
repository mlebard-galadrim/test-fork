import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import { navigate } from 'k2/app/navigation';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import DestinationType from '../models/DestinationType';
import { COLOR_SECONDARY, COLOR_LIGHT_BG, GUTTER } from 'k2/app/modules/common/styles/vars';
import { border } from 'k2/app/modules/common/styles/utils';
import { Button } from 'k2/app/modules/common/components/form';
import ClientFilter from 'k2/app/modules/installation/filters/ClientFilter';
import { PIPE_CLIENT_SELECTION } from 'k2/app/modules/installation/constants';
import { selectDestinationType, cancelDestinationTypeSelection } from '../actions/shippingPipe';
import { PIPE_SHIPPING_SUPPLIER_SELECTION, PIPE_SHIPPING_TREATMENT_SITE_SELECTION } from '../constants';
import Client from 'k2/app/modules/installation/models/Client';

class SelectDestinationType extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    selectDestinationType: PropTypes.func.isRequired,
    cancelDestinationTypeSelection: PropTypes.func.isRequired,
    /**
     * A pre selected client skips the client selection as next step and filters out sites.
     * It's used when performing a shipping out with an Ariane operation for a known client.
     */
    preSelectedClient: PropTypes.instanceOf(Client),
  };

  static defaultProps = {
    preSelectedClient: null,
  };

  static styles = {
    button: {
      flex: 1,
      margin: GUTTER / 2,
      padding: GUTTER / 2,
      ...border(2, 'solid', 'transparent'),
      borderRadius: 3,
      backgroundColor: COLOR_LIGHT_BG,
    },
    buttonLabel: {
      color: COLOR_SECONDARY,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  };

  constructor(props) {
    super(props);

    this.destinationTypes = [
      new DestinationType(DestinationType.TREATMENT_SITE),
      new DestinationType(DestinationType.SUPPLIER),
      new DestinationType(DestinationType.MY_WAREHOUSES),
      new DestinationType(DestinationType.MY_SITES),
      new DestinationType(DestinationType.MY_MOBILE_SITES),
    ];

    this.onPress = this.onPress.bind(this);
  }

  componentWillUnmount() {
    this.props.cancelDestinationTypeSelection();
  }

  /**
   * @param {DestinationType} destinationType
   */
  onPress(destinationType) {
    const { next, preSelectedClient } = this.props;

    this.props.selectDestinationType(destinationType);

    switch (destinationType.value) {
      case DestinationType.TREATMENT_SITE:
        navigate(PIPE_SHIPPING_TREATMENT_SITE_SELECTION, { next, preSelectedClient });
        break;

      case DestinationType.SUPPLIER:
        navigate(PIPE_SHIPPING_SUPPLIER_SELECTION, { next, preSelectedClient });
        break;

      case DestinationType.MY_SITES:
        // Handle the case were the client is pre-selected
        if (preSelectedClient !== null) {
          next({ next, filter: ClientFilter.STANDARD_SITE });
          break;
        }

        navigate(PIPE_CLIENT_SELECTION, {
          next,
          filter: ClientFilter.STANDARD_SITE,
          barcode: false,
        });
        break;

      case DestinationType.MY_WAREHOUSES:
        // Handle the case were the client is pre-selected
        if (preSelectedClient !== null) {
          next({ next, filter: ClientFilter.WAREHOUSE });
          break;
        }

        navigate(PIPE_CLIENT_SELECTION, {
          next,
          filter: ClientFilter.WAREHOUSE,
          barcode: false,
        });
        break;

      case DestinationType.MY_MOBILE_SITES:
        // Handle the case were the client is pre-selected
        if (preSelectedClient !== null) {
          next({ next, filter: ClientFilter.MOBILE });
          break;
        }

        navigate(PIPE_CLIENT_SELECTION, {
          next,
          filter: ClientFilter.MOBILE,
          barcode: false,
          geoloc: false,
        });
        break;

      default:
        throw new Error(`Unknown destination "${destinationType}".`);
    }
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;

    return (
      <WrapperView title={I18n.t('scenes.shipping.select_destination_type.title')} full>
        {this.destinationTypes.map(type => (
          <Button style={styles.button} key={type.value} onPress={() => this.onPress(type)}>
            <Text style={styles.buttonLabel}>{I18n.t(type.toString())}</Text>
          </Button>
        ))}
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    next: props.navigation.getParam('next'),
    preSelectedClient: state.installationPipe.client,
  }),
  dispatch => ({
    selectDestinationType: type => dispatch(selectDestinationType(type)),
    cancelDestinationTypeSelection: () => dispatch(cancelDestinationTypeSelection()),
  }),
)(SelectDestinationType);
