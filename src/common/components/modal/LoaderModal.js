import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, SafeAreaView } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import Loader from 'k2/app/modules/common/components/Loader';
import { COLOR_PRIMARY } from '../../styles/vars';

class LoaderModal extends Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  };

  static defaultProps = {
    children: null,
  };

  static styles = {
    modalContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLOR_PRIMARY,
    },
    spinner: {
      marginBottom: 20,
    },
    text: {
      color: '#fff',
      textAlign: 'center',
    },
  };

  renderChildren() {
    const { children } = this.props;
    const { styles } = LoaderModal;

    if (typeof children === 'string') {
      return <Text style={styles.text}>{children}</Text>;
    }

    return children;
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { visible } = this.props;
    const { styles } = LoaderModal;

    return (
      <Modal animationType="slide" visible={visible} onRequestClose={() => null}>
        <SafeAreaView style={styles.modalContent}>
          <Loader style={styles.spinner} />
          {this.renderChildren()}
        </SafeAreaView>
      </Modal>
    );
  }
}

export default LoaderModal;
