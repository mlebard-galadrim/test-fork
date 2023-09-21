import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { COLOR_NOTIFICATION } from '../styles/vars';

class IconBadge extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired, // badge presence
    color: PropTypes.string, // badge color
    label: PropTypes.string, // badge content
    children: PropTypes.node.isRequired, // children to decorate with the badge
    style: PropTypes.shape(), // Additional style
  };

  static defaultProps = {
    color: COLOR_NOTIFICATION,
    label: null,
    style: {
      wrapper: {},
      badge: {},
      label: {},
    },
  };

  static styles = {
    wrapper: {
      position: 'relative',
    },
    badge: {
      zIndex: 99,
      elevation: 99,
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 0,
      margin: 0,
    },
    counter: {
      height: 20,
      minWidth: 20,
      borderRadius: 20,
      paddingHorizontal: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pastille: {
      height: 8,
      width: 8,
      borderRadius: 8,
      top: 10,
      right: 6,
    },
    label: {
      color: '#FFF',
      fontSize: 10,
      fontWeight: 'bold',
    },
  };

  render() {
    const { styles } = this.constructor;
    const { active, color, label, children, style } = this.props;

    if (!active) {
      return children;
    }

    return (
      <View style={{ ...styles.wrapper, ...style.wrapper }}>
        <View
          style={{
            ...styles.badge,
            ...(label ? styles.counter : styles.pastille),
            backgroundColor: color,
            ...style.badge,
          }}
        >
          {label && <Text style={{ ...styles.label, ...style.label }}>{label}</Text>}
        </View>
        {children}
      </View>
    );
  }
}

export default IconBadge;
