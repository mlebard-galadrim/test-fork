import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View } from 'react-native';
import { SPACING, SPACING_TEXT } from 'k2/app/modules/common/styles/vars';
import useAppStoreUrl from 'k2/app/modules/common/hooks/useAppStoreUrl';
import Button from 'k2/app/modules/common/components/form/Button';
import { trans } from 'k2/app/I18n';
import Splash from 'k2/app/modules/common/scenes/Splash';

OutdatedAppVersionPopup.propTypes = {
  message: PropTypes.string.isRequired,
};

/**
 * Blocking screen for outdated apps to prevent further interaction without updating it.
 */
export default function OutdatedAppVersionPopup({ message }) {
  const { open: openAppStore } = useAppStoreUrl();

  function onPressUpdate() {
    openAppStore();
  }

  return (
    <Splash>
      <View style={styles.wrapper}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {trans('components.outdatedAppVersionPopup.title')}
        </Text>

        <Text style={styles.message}>{message}</Text>

        <Button styleName="secondary" style={styles.btn} onPress={onPressUpdate}>
          <Text style={styles.btnText}>{trans('components.outdatedAppVersionPopup.update')}</Text>
        </Button>
      </View>
    </Splash>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 0,
    flexDirection: 'column',
    padding: SPACING,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingVertical: SPACING,
    color: 'white',
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    paddingVertical: SPACING_TEXT,
    color: 'white',
    textAlign: 'center',
  },
  btn: {
    marginVertical: SPACING_TEXT * 4,
    justifyContent: 'center',
  },
  btnText: {
    fontSize: 20,
    color: 'white',
  },
});
