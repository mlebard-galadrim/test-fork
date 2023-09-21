import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, TouchableOpacity, SafeAreaView, View } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import { GUTTER, COLOR_PRIMARY } from 'k2/app/modules/common/styles/vars';
import { padding } from 'k2/app/modules/common/styles/utils';
import { throttle } from 'k2/app/modules/common/utils/NavigationUtils';

class TransitionModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
    duration: PropTypes.number,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    icon: PropTypes.node,
    children: PropTypes.node,
  };

  static defaultProps = {
    duration: 3,
    title: null,
    subtitle: null,
    icon: null,
    children: null,
  };

  static styles = {
    safeArea: {
      flex: 1,
      backgroundColor: COLOR_PRIMARY,
    },
    touchable: {
      flex: 0,
    },
    content: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    icon: {
      flex: 0,
      margin: GUTTER * 2,
      alignSelf: 'center',
    },
    title: {
      flex: 0,
      textAlign: 'center',
      margin: GUTTER * 2,
      ...padding(0, GUTTER),
    },
    subtitle: {
      flex: 0,
      textAlign: 'center',
      margin: GUTTER * 2,
      ...padding(0, GUTTER),
    },
  };

  constructor(props) {
    super(props);

    this.timeout = null;

    this.onClose = this.onClose.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  /**
   * @inheritdoc
   */
  componentDidUpdate(prevProps) {
    const { visible, duration } = this.props;

    if (prevProps.visible !== visible) {
      this.unregisterAutoClose();

      if (visible && duration) {
        this.timeout = setTimeout(this.onClose, duration * 1000);
      }
    }
  }

  /**
   * @inheritdoc
   */
  componentWillUnmount() {
    this.unregisterAutoClose();
  }

  onClose() {
    this.unregisterAutoClose();
    this.props.onClose();
  }

  unregisterAutoClose() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  }

  render() {
    const { visible, title, subtitle, icon, children } = this.props;
    const { styles } = this.constructor;

    return (
      <Modal visible={visible} onRequestClose={this.onClose}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <TouchableOpacity style={styles.touchable} onPress={throttle(this.onClose)}>
              {icon ? <View style={styles.icon}>{icon}</View> : null}
              {title ? (
                <Text styleName="title" style={styles.title}>
                  {title}
                </Text>
              ) : null}
              {subtitle ? (
                <Text styleName="subtitle" style={styles.subtitle}>
                  {subtitle}
                </Text>
              ) : null}
            </TouchableOpacity>
            {children}
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

export default TransitionModal;
