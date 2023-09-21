import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import logoDefault from 'k2/app/assets/logo/logo.png';
import logoWhite from 'k2/app/assets/logo/logo_white.png';

export default class Logo extends Component {
  static propTypes = {
    white: PropTypes.bool,
    size: PropTypes.oneOf(['default', 'small', 'big']),
  };

  static defaultProps = {
    white: false,
    size: 'default',
  };

  static styles = {
    big: {
      width: 256,
      height: 80,
    },
    default: {
      width: 208,
      height: 65,
    },
    small: {
      width: 144,
      height: 45,
    },
  };

  render() {
    const { styles } = this.constructor;
    const { size, white } = this.props;

    return <Image style={styles[size]} source={white ? logoWhite : logoDefault} />;
  }
}
