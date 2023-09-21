import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, ViewPropTypes } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import { throttle } from '../../utils/NavigationUtils';
import { COLOR_LIGHT_BG, COLOR_PRIMARY, COLOR_SECONDARY, COLOR_UNDERLAY } from 'k2/app/modules/common/styles/vars';

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  onLongPress: PropTypes.func,
  valid: PropTypes.bool,
  children: PropTypes.node,
  style: ViewPropTypes.style,
  styleName: PropTypes.oneOf(['muted', 'clear', 'secondary']),
};

Button.defaultProps = {
  onLongPress: () => {},
  valid: true,
  children: null,
  style: {},
  styleName: null,
};

Button.styles = {
  muted: {
    backgroundColor: COLOR_LIGHT_BG,
  },
  clear: {
    borderColor: COLOR_PRIMARY,
    backgroundColor: 'transparent',
  },
  secondary: {
    backgroundColor: COLOR_SECONDARY,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLOR_PRIMARY,
    borderRadius: 0,
  },
  textDefaultButton: {
    color: 'white',
    fontSize: 13,
  },
  secondaryText: {
    color: COLOR_UNDERLAY,
  },
};

export default function Button({ onPress, onLongPress, valid, children, style, styleName, ...remainingProps }) {
  const { styles } = Button;

  /**
   * Wrap in <Text> component if not already a component or a function
   */
  function wrapChildren(children) {
    const currentStyle = {
      ...styles.textDefaultButton,
      ...(!valid && styles.secondaryText),
    };

    if (['object', 'function'].includes(typeof children)) {
      return children;
    }

    return (
      <Text styleName="bold" style={currentStyle}>
        {children}
      </Text>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, style, styles[styleName] ?? {}, !valid ? styles.muted : {}]}
      disabled={!valid}
      onPress={throttle(onPress)}
      onLongPress={throttle(onLongPress)}
      {...remainingProps}
    >
      {wrapChildren(children)}
    </TouchableOpacity>
  );
}
