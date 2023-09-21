import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import { get } from 'k2/app/container';
import { FlatList, TouchableHighlight } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import View from 'k2/app/modules/common/components/View';
import Icon from 'k2/app/modules/common/components/Icon';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { Button } from 'k2/app/modules/common/components/form';
import { COLOR_ERROR, COLOR_SECONDARY, GUTTER } from 'k2/app/modules/common/styles/vars';
import { margin, padding } from 'k2/app/modules/common/styles/utils';
import BordereauIcon from 'k2/app/modules/trackdechets/components/BordereauIcon';
import { navigate } from 'k2/app/navigation';
import { PIPE_SHIPPING_BATCH_SCAN_TRACKDECHETS_BORDEREAUX } from 'k2/app/modules/shipping/constants';
import Loader from 'k2/app/modules/common/components/Loader';

/**
 * Attempt to auto-fetch BSFFs from API, for known Clim'app containers, if the device is online.
 */
function AutoFetchBordereaux(props) {
  const api = get('api');
  const { styles } = AutoFetchBordereaux;
  const { next, offline, containerUuids } = props;

  let [bordereaux, setBordereaux] = useState([]);
  const removeBordereau = id => setBordereaux(bordereaux.filter(bordereau => bordereau.bordereauId !== id));

  let [error, setError] = useState(false);
  let [loading, setLoading] = useState(false);

  const fetch = () => {
    // Else, attempt to find some BSFFs from scanned containers
    setLoading(true);
    setError(false);
    api.getLastKnownBsffsForContainers(
      containerUuids,
      data => {
        setBordereaux(Object.values(data.map(bordereauData => bordereauData)));
        setLoading(false);
      },
      apiError => {
        console.error(apiError);
        setError(true);
        setLoading(false);
      },
    );
  };

  // On component mount, attempt to fetch containers:
  useEffect(
    () => {
      // Whether we are offline or didn't scan any container, let's skip this step:
      if (offline || containerUuids.length === 0) {
        navigate(PIPE_SHIPPING_BATCH_SCAN_TRACKDECHETS_BORDEREAUX, { next }, 'replace');

        return;
      }

      fetch();
    },
    // Execute only once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const confirm = () => {
    navigate(
      PIPE_SHIPPING_BATCH_SCAN_TRACKDECHETS_BORDEREAUX,
      {
        next,
        initialBordereaux: bordereaux.map(bordereau => bordereau.bordereauId),
      },
      'replace',
    );
  };

  const skip = () => navigate(PIPE_SHIPPING_BATCH_SCAN_TRACKDECHETS_BORDEREAUX, { next }, 'replace');

  const skipButton = (
    <Button style={styles.button} styleName="secondary" onPress={skip}>
      {I18n.t('scenes.trackdechets_bordereaux.auto_fetch.skip')}
    </Button>
  );

  return (
    <WrapperView full style={styles.wrapper}>
      <Text styleName="title" style={styles.title}>
        {I18n.t('scenes.trackdechets_bordereaux.auto_fetch.title', {
          count: bordereaux.length,
        })}
      </Text>

      {/* loading… */}
      {loading && (
        <>
          <View style={styles.content}>
            <Loader color={COLOR_SECONDARY} style={styles.spinner} />
            <Text style={styles.text}>{I18n.t('scenes.trackdechets_bordereaux.auto_fetch.loading')}</Text>
          </View>
          <View style={styles.actions}>{skipButton}</View>
        </>
      )}

      {/* on error */}
      {error && (
        <>
          <View style={styles.content}>
            <Text style={{ ...styles.text, ...styles.error }}>
              {I18n.t('scenes.trackdechets_bordereaux.auto_fetch.error')}
            </Text>
          </View>
          <View style={styles.actions}>
            {skipButton}
            <Button style={styles.button} onPress={fetch}>
              {I18n.t('scenes.trackdechets_bordereaux.auto_fetch.retry')}
            </Button>
          </View>
        </>
      )}

      {/* on result */}
      {!error && !loading && bordereaux.length > 0 && (
        <>
          <Text style={styles.text}>{I18n.t('scenes.trackdechets_bordereaux.auto_fetch.found_bsffs')}</Text>
          <FlatList
            data={bordereaux}
            keyExtractor={bordereau => bordereau.bordereauId}
            renderItem={itemProps => <BordereauLine {...itemProps} remove={removeBordereau} />}
          />
          <View styleName="horizontal">
            {skipButton}
            <Button style={styles.button} onPress={confirm}>
              {I18n.t('scenes.trackdechets_bordereaux.auto_fetch.confirm')}
            </Button>
          </View>
        </>
      )}

      {/* on no result */}
      {!error && !loading && bordereaux.length === 0 && (
        <>
          <View style={styles.content}>
            <Text style={styles.text}>{I18n.t('scenes.trackdechets_bordereaux.auto_fetch.no_result')}</Text>
          </View>
          <View style={styles.actions}>{skipButton}</View>
        </>
      )}
    </WrapperView>
  );
}

AutoFetchBordereaux.propTypes = {
  next: PropTypes.func.isRequired,
  offline: PropTypes.bool.isRequired,
  containerUuids: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};

AutoFetchBordereaux.styles = {
  wrapper: {
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  actions: {
    flex: 0,
    flexDirection: 'row',
  },
  button: {
    flex: 1,
    borderRadius: 0,
    height: 42,
  },
  title: {
    flex: 0,
    textAlign: 'center',
    ...margin(GUTTER, 0),
    padding: GUTTER,
  },
  spinner: {
    ...margin(GUTTER, 0),
  },
  text: {
    flex: 0,
    textAlign: 'center',
    ...margin(GUTTER, 0),
    padding: GUTTER,
    fontSize: 18,
  },
  error: {
    color: COLOR_ERROR,
  },
  list: {
    flex: 0,
    flexBasis: 100,
  },
};

function BordereauLine({ item: bordereau, remove }) {
  const { styles } = BordereauLine;
  return (
    <View style={styles.row} key={`bordereau-${bordereau.bordereauId}`}>
      <View style={styles.icon}>
        <BordereauIcon />
      </View>
      <View style={styles.label}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
          {bordereau.designation}
        </Text>
        <Text styleName="caption" ellipsizeMode="tail" numberOfLines={1} style={styles.details}>
          {bordereau.bordereauId} - {bordereau.barcode}
        </Text>
      </View>
      <TouchableHighlight style={styles.action} onPress={() => remove(bordereau.bordereauId)}>
        <Icon style={styles.details} name="times" />
      </TouchableHighlight>
    </View>
  );
}

BordereauLine.styles = {
  row: {
    flex: 1,
    flexDirection: 'row',
    ...margin(GUTTER / 2, 0),
  },
  label: {
    flex: 1,
    padding: 0,
  },
  action: {
    flex: 0,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    ...padding(0, GUTTER),
  },
  icon: {
    flex: 0,
    paddingLeft: GUTTER,
    paddingRight: GUTTER / 2,
    justifyContent: 'center',
  },
  title: {
    color: 'black',
  },
  details: {
    color: COLOR_SECONDARY,
  },
};

export default connect((state, props) => ({
  next: props.navigation.getParam('next'),
  offline: state.device.offline,
  containerUuids: state.shippingReducer.containerIdentifiers || [],
}))(AutoFetchBordereaux);
