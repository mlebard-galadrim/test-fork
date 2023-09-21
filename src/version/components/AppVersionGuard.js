import React, { createContext, useCallback, useContext } from 'react';
import OutdatedAppVersionPopup from './OutdatedAppVersionPopup';
import useCheckVersion from '../hooks/useCheckVersion';
import PropTypes from 'prop-types';
import Text from 'k2/app/modules/common/components/Text';
import { ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { SPACING_TEXT } from 'k2/app/modules/common/styles/vars';
import alpha from 'k2/app/modules/common/styles/colors';
import { trans } from 'k2/app/I18n';

const Context = createContext({
  checkVersion: async () => {},
});

Provider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Guard that can be triggered from within the to display a loading overlay while checking the app version,
 * but keeping the underlying app mounted on contrary of the `AppVersionChecker`.
 */
function Provider({ children }) {
  const { outdated, message, checkVersion: fetch, called, loading, error } = useCheckVersion();

  const checkVersion = useCallback(async () => {
    try {
      // Return outdated or not:
      return await fetch();
    } catch (err) {
      // On error, consider not outdated
      return false;
    }
  }, [fetch]);

  /*
   * display a loading overlay, with the app underneath:
   * - until called
   * - while loading
   * - if there is an error during the call (ignoring it)
   * - if the app is not outdated
   */
  if (!called || loading || error || outdated !== true) {
    return (
      <Context.Provider value={{ checkVersion }}>
        <LoadingOverlay loading={loading} />
        {children}
      </Context.Provider>
    );
  }

  // Unmount the app and display the popup:
  return <OutdatedAppVersionPopup message={message} />;
}

LoadingOverlay.propTypes = {
  loading: PropTypes.bool.isRequired,
};

function LoadingOverlay({ loading }) {
  const { styles } = LoadingOverlay;
  return (
    <Modal
      style={styles.overlay}
      animationType="none"
      statusBarTranslucent
      transparent
      presentationStyle="overFullScreen"
      visible={loading}
    >
      <SafeAreaView style={styles.wrapper}>
        <ActivityIndicator />
        <Text style={styles.text}>{trans('components.outdatedAppVersionGuard.loading')}</Text>
      </SafeAreaView>
    </Modal>
  );
}

LoadingOverlay.styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontStyle: 'italic',
    padding: SPACING_TEXT,
    color: 'white',
    textShadowColor: alpha('#000000', 0.5),
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
});

const AppVersionGuard = {
  Provider,
  Context,
  useContext() {
    return useContext(Context);
  },
};

export default AppVersionGuard;
