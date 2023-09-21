import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';
import Geolocator from '@react-native-community/geolocation';
import { get } from 'k2/app/container';
import { pop } from 'k2/app/navigation';
import Loader from 'k2/app/modules/common/components/Loader';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import MainListView from 'k2/app/modules/common/components/list/MainListView';
import GeoUtils from 'k2/app/modules/common/utils/GeoUtils';
import GeoError from 'k2/app/modules/common/utils/GeoError';
import { Button } from 'k2/app/modules/common/components/form';
import { fixed } from 'k2/app/modules/common/utils/filterUtils';
import { COLOR_SECONDARY } from 'k2/app/modules/common/styles/vars';
import { selectSite } from '../actions/installationPipe';
import SiteFilter from '../filters/SiteFilter';

class Geolocation extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    selectSite: PropTypes.func.isRequired,
    filter: PropTypes.oneOf(SiteFilter.values),
  };

  static defaultProps = {
    filter: null,
  };

  static styles = {
    infos: {
      flex: 1,
    },
    name: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      color: COLOR_SECONDARY,
    },
    distance: {
      flex: 0,
      fontSize: 15,
      color: COLOR_SECONDARY,
      alignSelf: 'center',
    },
    wrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spinner: {
      flex: 0,
      marginBottom: 20,
    },
  };

  // Valuable approximation of 1 degree latitude distance
  static distanceApproximation = 111111;

  static searchRadius = 5000; // 5km
  static timeout = 30 * 1000; // 30s
  static maximumAge = 60 * 1000; // 1min

  static enableHighAccuracy = false;

  constructor(props) {
    super(props);

    this.siteRepository = get('site_repository');

    this.state = {
      latitude: null,
      latitudeDiff: this.constructor.searchRadius / this.constructor.distanceApproximation,
      longitude: null,
      longitudeDiff: 0,
      error: null,
    };

    this.getLongitudeDiff = this.getLongitudeDiff.bind(this);
    this.renderSite = this.renderSite.bind(this);
    this.pressSite = this.pressSite.bind(this);
    this.onPositionChange = this.onPositionChange.bind(this);
    this.onPositionError = this.onPositionError.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  componentDidMount() {
    const { enableHighAccuracy, timeout, maximumAge } = this.constructor;

    Geolocator.getCurrentPosition(this.onPositionChange, this.onPositionError, {
      enableHighAccuracy,
      timeout,
      maximumAge,
    });
  }

  /**
   * {@inheritdoc}
   */
  componentWillUnmount() {
    this.props.selectSite(null);
  }

  /**
   * Update state after geoloc reception
   *
   * @param {Object} position
   */
  onPositionChange(position) {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }

  /**
   * Throws error when position isn't determinable
   *
   * @param {Object|string} error
   *
   * @throws {Error}
   */
  onPositionError(error) {
    const code = typeof error.code !== 'undefined' ? error.code : GeoError.UNKNOWN;

    this.setState({ error: GeoError.readableFor(code) });
  }

  /**
   * Calculate approximate acceptable longitude diff knowing current latitude and search radius
   *
   * @param {float} latitude
   *
   * @returns {number}
   */
  getLongitudeDiff(latitude) {
    return (
      this.constructor.searchRadius /
      (this.constructor.distanceApproximation * Math.cos(GeoUtils.degreeToRadian(latitude)))
    );
  }

  /**
   * @param {Site} site
   */
  pressSite(site) {
    this.props.selectSite(site);
    this.props.next({ site });
  }

  renderSite(site, distance) {
    const { styles } = this.constructor;

    return (
      <View>
        <View style={styles.infos} styleName="vertical">
          <Text style={styles.name}>{site.name}</Text>
          <Text>{site.client.name}</Text>
        </View>
        <Text style={styles.distance}>{fixed(distance)}km</Text>
      </View>
    );
  }

  render() {
    const { styles } = this.constructor;
    const { latitude, latitudeDiff, longitude, error } = this.state;
    const { filter } = this.props;

    if (error) {
      return (
        <WrapperView full>
          <View style={styles.wrapper}>
            <Text>{I18n.t(error)}</Text>
          </View>
          <Button styleName="secondary" onPress={pop}>
            {I18n.t('scenes.installation.installation.confirm.no_result.text_back')}
          </Button>
        </WrapperView>
      );
    }

    if (latitude === null) {
      return (
        <WrapperView>
          <View style={styles.wrapper}>
            <Loader color={COLOR_SECONDARY} style={styles.spinner} />
            <Text>{I18n.t('scenes.installation.client.loading')}</Text>
          </View>
        </WrapperView>
      );
    }

    const result = new Map();
    const longitudeDiff = this.getLongitudeDiff(latitude);
    const sitesList = Array.from(
      this.siteRepository.findForGivenLocationWithFilter(
        latitude - latitudeDiff,
        latitude + latitudeDiff,
        longitude - longitudeDiff,
        longitude + longitudeDiff,
        filter,
      ),
    );

    if (sitesList.length === 0) {
      return (
        <WrapperView title={I18n.t('scenes.installation.client.no_result')}>
          <Button styleName="secondary" onPress={pop}>
            {I18n.t('scenes.installation.installation.confirm.no_result.text_back')}
          </Button>
        </WrapperView>
      );
    }

    sitesList.forEach(site => {
      result.set(site, GeoUtils.getDistanceFromLatLonInKm(latitude, longitude, site.latitude, site.longitude));
    });

    sitesList.sort((a, b) => (result.get(a) > result.get(b) ? 1 : -1));

    const title = I18n.t('scenes.installation.site.geolocation.many_results.title', {
      length: sitesList.length,
    });

    return (
      <WrapperView full title={title}>
        <MainListView
          data={sitesList}
          onPressItem={this.pressSite}
          renderContent={site => this.renderSite(site, result.get(site))}
        />
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    selectSite: site => dispatch(selectSite(site)),
  }),
)(Geolocation);
