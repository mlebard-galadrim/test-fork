import * as React from 'react';
import PropTypes from 'prop-types';
import RNIcon from 'react-native-vector-icons/FontAwesome5';

export default class Icon extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    style: PropTypes.shape(),
  };

  static defaultProps = {
    style: {},
  };

  render() {
    return <RNIcon name={this.props.name} style={this.props.style} />;
  }
}
