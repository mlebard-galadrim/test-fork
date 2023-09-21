import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import { withNavigationFocus } from 'react-navigation';
import { get } from 'k2/app/container';
import { FlatList, TextInput, TouchableHighlight, TouchableOpacity, Vibration } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import View from 'k2/app/modules/common/components/View';
import Icon from 'k2/app/modules/common/components/Icon';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import Scan from 'k2/app/modules/common/components/Scan';
import { Button } from 'k2/app/modules/common/components/form';
import { GUTTER } from 'k2/app/modules/common/styles/vars';
import { margin, padding } from 'k2/app/modules/common/styles/utils';
import {
  cancelTrackdechetsBordereaux,
  confirmTrackdechetsBordereaux,
} from 'k2/app/modules/shipping/actions/shippingPipe';
import ArrayUtils from 'k2/app/modules/common/utils/arrayUtils';
import BordereauIcon from 'k2/app/modules/trackdechets/components/BordereauIcon';
import Config from 'react-native-config';
import TrackDechetsIdentifiers from 'k2/app/modules/trackdechets/utils/identifiers';

/**
 * Batch Scan BSFFs/BSDDs for shippings with Trackdéchets
 *
 * Ex:
 * BSD-20210928-MVJJHYFDJ
 * FF-20210927-RK57KRE51
 * BSD-20210927-RK57KRE51
 */
function BatchScanBordereaux(props) {
  const analytics = get('firebase-analytics');

  const { styles } = BatchScanBordereaux;
  const { isFocused, cancel, next, hasContainers, devMode, initialBordereaux } = props;

  useEffect(() => {
    // On component unmounted:
    return cancel;
  }, [cancel]);

  /** Open / close the list of bordereaux */
  const [listOpened, setListOpened] = useState(false);
  const toggleListOpened = () => setListOpened(!listOpened);

  let [bordereaux, setBordereaux] = useState(initialBordereaux);
  const removeBordereau = number => setBordereaux((bordereaux = ArrayUtils.removeElement(bordereaux, number)));
  const addBordereau = number => setBordereaux((bordereaux = ArrayUtils.addUniqueElement(bordereaux, number)));

  const confirm = () => {
    const bsffs = bordereaux.filter(TrackDechetsIdentifiers.isBsffNumber);
    const bsdds = bordereaux.filter(TrackDechetsIdentifiers.isBsddNumber);

    props.confirm(bsffs, bsdds);

    next();
  };

  /**
   * Catch the camera result on code detection
   *
   * @param {String} code
   */
  const onCode = code => {
    analytics.logEvent('trackdechets_bordereaux_batch_scan');

    const { error, success } = Scan.styles.flash;
    let flashColor = error;

    if (TrackDechetsIdentifiers.isValid(code)) {
      addBordereau(code);
      flashColor = success;
    }

    this.scan.flash(flashColor);

    Vibration.vibrate();
  };

  return (
    <WrapperView full style={styles.wrapper}>
      <Scan
        style={styles.scan}
        onCode={code => {
          if (isFocused && !listOpened) {
            onCode(code);
          }
        }}
        active={isFocused}
        ref={scan => {
          this.scan = scan;
        }}
      >
        <Text styleName="title" style={styles.title}>
          {I18n.t('scenes.trackdechets_bordereaux.batch_scan.title', {
            count: bordereaux.length,
          })}
        </Text>
        <View style={listOpened ? styles.open.list : styles.list}>
          <TouchableOpacity style={styles.toggleList} onPress={toggleListOpened}>
            <Icon
              style={{ ...styles.containerDetails, ...styles.toggleListIcon }}
              name={listOpened ? 'chevron-down' : 'chevron-up'}
            />
          </TouchableOpacity>
          <FlatList
            data={bordereaux}
            keyExtractor={number => number}
            renderItem={itemProps => <BordereauLine {...itemProps} remove={removeBordereau} />}
          />
        </View>
      </Scan>
      <DevModeInput onCode={onCode} devMode={devMode} />
      <View styleName="horizontal">
        <Button
          style={styles.validate}
          onPress={confirm}
          /* Should only be able to submit without any bordereaux if containers were selected before */
          valid={hasContainers || (!hasContainers && bordereaux.length > 0)}
        >
          {bordereaux.length === 0
            ? I18n.t('scenes.trackdechets_bordereaux.batch_scan.next_no_bordereaux')
            : I18n.t('common.next')}
        </Button>
      </View>
    </WrapperView>
  );
}

BatchScanBordereaux.propTypes = {
  next: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  devMode: PropTypes.bool,
  hasContainers: PropTypes.bool,
};

BatchScanBordereaux.styles = {
  wrapper: {
    flexDirection: 'column',
  },
  scan: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  validate: {
    flex: 1,
    borderRadius: 0,
    height: 42,
  },
  title: {
    flex: 0,
    textAlign: 'center',
    ...margin(GUTTER, 0),
    padding: GUTTER,
    color: 'white',
  },
  list: {
    flex: 0,
    flexBasis: 100,
  },
  toggleList: {
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: 38,
  },
  toggleListIcon: {
    fontSize: 14,
    color: 'white',
  },
  open: {
    list: {
      flex: 1,
      backgroundColor: 'rgba(30, 30, 30, 0.9)',
    },
  },
};

function BordereauLine({ item: number, remove }) {
  const { styles } = BordereauLine;
  return (
    <View style={styles.row} key={`bordereau-${number}`}>
      <View style={styles.icon}>
        <BordereauIcon />
      </View>
      <View style={styles.label}>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
          {number}
        </Text>
        <Text styleName="caption" ellipsizeMode="tail" numberOfLines={1} style={styles.details}>
          {number}
        </Text>
      </View>
      <TouchableHighlight style={styles.action} onPress={() => remove(number)}>
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
    color: 'white',
  },
  details: {
    color: '#ccc',
  },
};

function DevModeInput({ devMode, onCode }) {
  const ref = useRef();

  if (!devMode) {
    return null;
  }

  return (
    <TextInput
      ref={ref}
      autoFocus={true}
      style={DevModeInput.styles.devInput}
      onSubmitEditing={e => {
        e.nativeEvent.text
          .split('\n')
          .filter(Boolean)
          .forEach((code, i) => setTimeout(() => onCode(code), i * 50));
        ref.current.clear();
        ref.current.focus();
      }}
      multiline
      autoCorrect={false}
      autoCapitalize="none"
      blurOnSubmit={false}
      placeholder="Enter barcode in dev mode"
      clearButtonMode="while-editing"
    />
  );
}

DevModeInput.styles = {
  devInput: { backgroundColor: 'grey' },
};

export default connect(
  (state, props) => ({
    next: props.navigation.getParam('next'),
    devMode: Config.APP_ENV === 'development',
    hasContainers: state.shippingReducer.containerIdentifiers && state.shippingReducer.containerIdentifiers.length > 0,
    initialBordereaux: props.navigation.getParam('initialBordereaux') || [],
  }),
  dispatch => ({
    confirm: (bsffs, bsdds) => dispatch(confirmTrackdechetsBordereaux(bsffs, bsdds)),
    cancel: () => dispatch(cancelTrackdechetsBordereaux()),
  }),
)(withNavigationFocus(BatchScanBordereaux));
