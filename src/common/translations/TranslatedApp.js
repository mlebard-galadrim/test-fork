import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useInitLocaleFromUserPreferences } from 'k2/app/I18n';
import Splash from 'k2/app/modules/common/scenes/Splash';

TranslatedApp.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Initialize the locale from the user preferences and renders tha SplashScreen until the locale is fully loaded.
 */
export default function TranslatedApp({ children }) {
  const { init, loaded } = useInitLocaleFromUserPreferences();

  /**
   * Initializes the locale from the user preferences on mount:
   */
  useEffect(() => {
    if (!loaded) {
      init().done();
    }
  }, [init, loaded]);

  if (!loaded) {
    // Display the splash screen while loading:
    return <Splash />;
  }

  return children;
}
