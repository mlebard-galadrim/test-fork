import * as React from 'react';
import PropTypes from 'prop-types';
import { Text as RNText } from 'react-native';
import { COLOR_PRIMARY, COLOR_WARNING } from 'k2/app/modules/common/styles/vars';

class Text extends React.PureComponent {
  static propTypes = {
    styleName: PropTypes.oneOf(['heading', 'title', 'subtitle', 'caption', 'bold', 'default', 'notice']),
    style: PropTypes.shape(),
  };

  static defaultProps = {
    styleName: null,
    style: {},
  };

  static styles = {
    heading: {
      color: '#222222',
      fontSize: 25,
    },
    title: {
      fontSize: 20,
      color: '#222222',
    },
    subtitle: {
      color: COLOR_PRIMARY,
      fontSize: 15,
    },
    notice: {
      color: COLOR_WARNING,
    },
    caption: {
      fontSize: 12,
      color: '#666666',
    },
    bold: {
      fontWeight: '600',
    },
    default: {
      fontFamily: 'Rubik-Regular',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 15,
      color: '#666666',
    },
  };

  render() {
    const { styles } = this.constructor;
    const { styleName, style, ...props } = this.props;
    const currentStyle = {
      ...styles.default,
      ...(styleName && styles[styleName]),
      ...style,
    };

    return (
      <RNText style={currentStyle} {...props}>
        {this.props.children}
      </RNText>
    );
  }
}

export default Text;
