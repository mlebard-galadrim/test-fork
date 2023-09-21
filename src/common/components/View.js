import * as React from 'react';
import PropTypes from 'prop-types';
import { View as RNView } from 'react-native';

class View extends React.PureComponent {
  static propTypes = {
    styleName: PropTypes.oneOf(['horizontal']),
  };

  static defaultProps = {
    styleName: null,
    style: {},
  };

  static styles = {
    horizontal: {
      flexDirection: 'row',
    },
  };

  render() {
    const { styles } = this.constructor;
    const { styleName, style, ...other } = this.props;
    const currentStyle = {
      ...style,
      ...(styleName && styles[styleName]),
    };

    return (
      <RNView style={currentStyle} {...other}>
        {this.props.children}
      </RNView>
    );
  }
}

export default View;
