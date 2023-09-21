import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import Loader from 'k2/app/modules/common/components/Loader';
import Logo from 'k2/app/modules/common/components/Logo';
import { COLOR_PRIMARY } from 'k2/app/modules/common/styles/vars';

Splash.propTypes = {
  message: PropTypes.string,
  children: PropTypes.node,
};

Splash.defaultProps = {
  message: null,
  children: null,
};

export default function Splash({ children, message }) {
  const { styles } = Splash;

  return (
    <View style={styles.wrapper}>
      <Logo white />

      {children ? (
        children
      ) : (
        <>
          <Text style={styles.message}>{message}</Text>
          <Loader style={styles.spinner} />
        </>
      )}
    </View>
  );
}

Splash.styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_PRIMARY,
  },
  message: {
    color: 'white',
  },
  spinner: {
    margin: 80,
  },
});
