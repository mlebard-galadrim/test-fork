import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, SafeAreaView, View, Platform } from 'react-native';
import I18n from 'i18n-js';
import NavigationBar from 'react-native-navbar';
import NavigationButton from '../NavigationButton';
import { GUTTER, COLOR_PRIMARY } from '../../styles/vars';

class ModalView extends Component {
  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    visible: PropTypes.bool,
    onCloseModal: PropTypes.func.isRequired,
    full: PropTypes.bool,
    onValidateModal: PropTypes.func,
    validateTitle: PropTypes.string,
  };

  static defaultProps = {
    title: null,
    visible: false,
    children: null,
    full: false,
    onValidateModal: null,
    validateTitle: 'common.ok',
  };

  static styles = {
    safeArea: {
      flex: 1,
      backgroundColor: COLOR_PRIMARY,
    },
    modal: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    normal: {
      flex: 1,
      padding: GUTTER,
      backgroundColor: '#fff',
    },
    full: {
      flex: 1,
      backgroundColor: '#fff',
    },
    navBar: {
      marginTop: Platform.OS === 'ios' ? -20 : 0,
      backgroundColor: COLOR_PRIMARY,
    },
    navBarTitle: {
      fontSize: 14,
    },
  };

  /**
   * Render validate button (or empty view)
   *
   * @return {Component}
   */
  renderValidateButton() {
    const { onValidateModal, validateTitle } = this.props;

    if (!onValidateModal) {
      return null;
    }

    return <NavigationButton label={I18n.t(validateTitle)} onPress={onValidateModal} testID="validate" />;
  }

  /**
   * Render clode button
   *
   * @return {Component}
   */
  renderCloseButton() {
    const { onCloseModal } = this.props;

    return <NavigationButton icon="times" onPress={onCloseModal} testID="close" />;
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = ModalView;
    const { children, onCloseModal, title, visible, full } = this.props;

    if (!children) {
      return null;
    }

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={visible}
        style={styles.modal}
        onRequestClose={onCloseModal}
        supportedOrientations={['portrait']}
      >
        <SafeAreaView style={styles.safeArea}>
          <NavigationBar
            title={{ title, style: styles.navBarTitle, tintColor: 'white' }}
            style={styles.navBar}
            leftButton={this.renderCloseButton()}
            rightButton={this.renderValidateButton()}
          />
          <View style={full ? styles.full : styles.normal}>{children}</View>
        </SafeAreaView>
      </Modal>
    );
  }
}

export default ModalView;
