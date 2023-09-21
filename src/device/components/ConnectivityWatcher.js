import { Component } from 'react';
import PropTypes from 'prop-types';
import NetInfo from '@react-native-community/netinfo';
import { connect } from 'react-redux';
import { connectivity } from '../actions/deviceActions';

class ConnectivityWatcher extends Component {
  static propTypes = {
    setConnectivity: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  constructor() {
    super();

    this.onConnectionInfo = this.onConnectionInfo.bind(this);
  }

  componentDidMount() {
    this.unsubscribe = NetInfo.addEventListener(this.onConnectionInfo);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  /**
   * On connectivity change
   *
   * @param {Object} connection
   */
  onConnectionInfo(connection) {
    this.props.setConnectivity(connection.type);
  }

  render() {
    return this.props.children;
  }
}

export default connect(
  () => ({}),
  dispatch => ({
    setConnectivity: type => dispatch(connectivity(type !== 'none')),
  }),
)(ConnectivityWatcher);
