import * as React from 'react';
import { ActivityIndicator, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

class Loader extends React.PureComponent {
  static propTypes = {
    color: PropTypes.string,
    style: ViewPropTypes.style,
  };
  static defaultProps = {
    color: 'white',
    style: {},
  };

  render() {
    return <ActivityIndicator size="small" color={this.props.color} style={this.props.style} />;
  }
}

export default Loader;
