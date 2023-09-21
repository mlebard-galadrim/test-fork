import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import { COLOR_PRIMARY, COLOR_LIGHT_BG } from '../styles/vars';

class Fieldset extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
  };

  static styles = {
    wrapper: {
      marginTop: 10,
    },
    title: {
      position: 'relative',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    text: {
      padding: 5,
      marginLeft: 15,
      fontWeight: '500',
      fontSize: 12,
      color: COLOR_PRIMARY,
      backgroundColor: '#fff',
      zIndex: 2,
    },
    border: {
      position: 'absolute',
      top: 9,
      left: 0,
      right: 0,
      borderWidth: 3,
      borderColor: COLOR_LIGHT_BG,
      zIndex: 1,
    },
  };

  render() {
    const { styles } = Fieldset;
    const { children, title, ...props } = this.props;

    return (
      <View style={styles.wrapper} {...props}>
        <View style={styles.title}>
          <Text style={styles.text}>{title.toUpperCase()}</Text>
          <View style={styles.border} />
        </View>
        {children}
      </View>
    );
  }
}

export default Fieldset;
