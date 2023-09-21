import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import I18n from 'i18n-js';
import { Image } from 'react-native';
import View from 'k2/app/modules/common/components/View';
import Text from 'k2/app/modules/common/components/Text';
import ClientFilter from '../filters/ClientFilter';
import SiteFilter from '../filters/SiteFilter';
import InstallationFilter from '../filters/InstallationFilter';
import barcodeIcon from '../../../assets/icons/barcode.png';
import geolocIcon from '../../../assets/icons/geoloc.png';
import { GUTTER, COLOR_SECONDARY } from '../../common/styles/vars';
import { Button } from '../../common/components/form';
import { PIPE_INSTALLATION_GEOLOC, PIPE_SCAN_INSTALLATION } from '../constants';

class FiltersList extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    geoloc: PropTypes.bool,
    barcode: PropTypes.bool,
    filter: PropTypes.oneOf(ClientFilter.values),
  };

  static defaultProps = {
    geoloc: true,
    barcode: true,
    filter: null,
  };

  static styles = {
    button: {
      flex: 1,
      padding: GUTTER,
      flexDirection: 'column',
      alignItems: 'center',
    },
    image: {
      flexBasis: 31,
      flex: 0,
      padding: 0,
      margin: 0,
    },
    label: {
      textAlign: 'center',
      flex: 0,
      padding: 0,
      margin: 0,
      marginTop: GUTTER / 2,
      color: COLOR_SECONDARY,
      fontSize: 10,
    },
  };

  constructor(props) {
    super(props);

    this.analytics = get('firebase-analytics');

    this.onGeolocation = this.onGeolocation.bind(this);
    this.onScan = this.onScan.bind(this);
  }

  onGeolocation() {
    const { next, filter } = this.props;

    this.analytics.logEvent('client_geolocation');

    navigate(PIPE_INSTALLATION_GEOLOC, {
      next,
      filter: SiteFilter.mask(filter),
    });
  }

  onScan() {
    const { next, filter } = this.props;

    this.analytics.logEvent('client_scan');

    navigate(PIPE_SCAN_INSTALLATION, {
      next,
      filter: InstallationFilter.mask(filter),
    });
  }

  render() {
    const { styles } = FiltersList;
    const { geoloc, barcode } = this.props;

    return (
      <View styleName="horizontal">
        {geoloc && (
          <Button style={styles.button} title="geoloc" styleName="clear" onPress={this.onGeolocation}>
            <Image source={geolocIcon} resizeMode="contain" style={styles.image} />
            <Text style={styles.label}>{I18n.t('common.filter.geolocation')}</Text>
          </Button>
        )}
        {barcode && (
          <Button style={styles.button} title="barcode" styleName="clear" onPress={this.onScan}>
            <Image source={barcodeIcon} resizeMode="contain" style={styles.image} />
            <Text style={styles.label}>{I18n.t('common.filter.scann')}</Text>
          </Button>
        )}
      </View>
    );
  }
}

export default FiltersList;
