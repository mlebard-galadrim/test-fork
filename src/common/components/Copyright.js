import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Config from 'react-native-config';
import Text from 'k2/app/modules/common/components/Text';
import { COLOR_PRIMARY } from 'k2/app/modules/common/styles/vars';

export default class Copyright extends Component {
  static propTypes = {
    verbose: PropTypes.bool.isRequired,
    style: PropTypes.shape(),
  };

  static defaultProps = {
    verbose: Config.APP_ENV !== 'production',
    style: null,
  };

  static styles = {
    copyright: {
      color: COLOR_PRIMARY,
      opacity: 0.8,
      fontSize: 14,
    },
  };

  render() {
    const { styles } = this.constructor;
    const { verbose, style } = this.props;
    const { APP_VERSION, APP_BUILD, APP_ENV } = Config;

    return (
      <Text style={{ ...styles.copyright, ...style }}>
        {new Date().getFullYear()}
        {`- Clim'App v${APP_VERSION}`}
        {verbose ? ` #${APP_BUILD}` : ''}
        {verbose ? ` [${APP_ENV}]` : ''}
      </Text>
    );
  }
}
