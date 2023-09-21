import React, { useEffect } from 'react';
import OutdatedAppVersionPopup from './OutdatedAppVersionPopup';
import useCheckVersion from '../hooks/useCheckVersion';
import PropTypes from 'prop-types';
import Splash from 'k2/app/modules/common/scenes/Splash';

AppVersionChecker.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Checks the app version and display a blocking screen instead of the app if it is outdated.
 */
export default function AppVersionChecker({ children }) {
  const { outdated, message, checkVersion, called, loading, error } = useCheckVersion();

  /**
   * Do the call once:
   */
  useEffect(() => {
    if (called) {
      // noop: already called
      return;
    }

    // Then check the version by reaching our API:
    checkVersion().done();
  }, [called, checkVersion]);

  if (!called || loading) {
    // While loading, display the splash screen:
    return <Splash />;
  }

  if (error) {
    // On error, explicitly ignore (the user might not have network access)
    return children;
  }

  if (!outdated) {
    // On up-to-date, render the app
    return children;
  }

  return <OutdatedAppVersionPopup message={message} />;
}
