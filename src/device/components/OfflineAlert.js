import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import Icon from 'k2/app/modules/common/components/Icon';
import { COLOR_SECONDARY } from '../../common/styles/vars';

class OfflineAlert extends Component {
  static propTypes = {
    offline: PropTypes.bool.isRequired,
  };

  static styles = {
    view: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: 6,
      backgroundColor: COLOR_SECONDARY,
      zIndex: 1,
      opacity: 0.8,
    },
    text: {
      fontSize: 13,
      textAlign: 'center',
      color: 'white',
    },
    close: {
      position: 'absolute',
      right: 6,
      top: 4,
      fontSize: 18,
      color: 'white',
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      displayed: props.offline,
    };

    this.onClose = this.onClose.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  componentDidUpdate(prevProps) {
    const { offline } = this.props;

    if (offline !== prevProps.offline) {
      this.setState({ displayed: offline });
    }
  }

  /**
   * On close alert
   */
  onClose() {
    this.setState({ displayed: false });
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = OfflineAlert;
    const { displayed } = this.state;

    if (!displayed) {
      return null;
    }

    return (
      <View style={styles.view}>
        <Text style={styles.text}>{I18n.t('common.offline')}</Text>
        <Icon style={styles.close} onPress={this.onClose} name="times" />
      </View>
    );
  }
}

export default connect(state => ({ offline: state.device.offline }))(OfflineAlert);
