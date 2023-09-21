import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, View } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import Icon from 'k2/app/modules/common/components/Icon';
import ModalView from './modal/ModalView';
import { COLOR_PRIMARY, COLOR_UNDERLAY } from '../styles/vars';

class HelperBox extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    displayModal: PropTypes.bool,
  };

  static defaultProps = {
    displayModal: false,
  };

  static styles = {
    layout: {
      justifyContent: 'flex-end',
      padding: 10,
      borderTopWidth: 1,
      borderColor: '#CCC',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      marginRight: 5,
    },
    modal: {
      flex: 1,
      marginTop: 70,
      alignItems: 'center',
    },
    modalIcon: {
      color: COLOR_PRIMARY,
      fontSize: 120,
      marginBottom: 10,
    },
    modalTitle: {
      fontSize: 22,
      marginBottom: 30,
    },
    modalContent: {
      fontSize: 18,
      textAlign: 'center',
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      displayModal: props.displayModal,
    };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  /**
   * Display modal
   */
  showModal() {
    this.setState({ displayModal: true });
  }

  /**
   * Hide modal
   */
  hideModal() {
    this.setState({ displayModal: false });
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { displayModal } = this.state;
    const { content, title } = this.props;

    return (
      <View>
        <ModalView title={I18n.t('common.helper_box.title')} visible={displayModal} onCloseModal={this.hideModal}>
          <View style={styles.modal}>
            <Icon style={styles.modalIcon} name="info-circle" />
            <Text style={styles.modalTitle} styleName="title">
              {title}
            </Text>
            <Text style={styles.modalContent}>{content}</Text>
          </View>
        </ModalView>
        <TouchableHighlight onPress={this.showModal} underlayColor={COLOR_UNDERLAY} style={styles.layout}>
          <View style={styles.content}>
            <Icon style={styles.icon} name="info-circle" />
            <Text>{title}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

export default HelperBox;
