import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableHighlight, Image, Modal, View } from 'react-native';
import SignatureCapture from 'react-native-signature-capture';
import I18n from 'i18n-js';
import Text from 'k2/app/modules/common/components/Text';
import Loader from 'k2/app/modules/common/components/Loader';
import { padding, margin } from '../styles/utils';
import { HEIGHT_HEADER, STATUS_BAR, COLOR_PRIMARY } from '../styles/vars';
import NavigationButton from './NavigationButton';
import { throttle } from '../utils/NavigationUtils';

/**
 * SignatureBox
 */
class SignatureBox extends Component {
  static DATA_URI_PREFIX = 'data:image/png;base64,';

  static propTypes = {
    onSignature: PropTypes.func.isRequired,
    title: PropTypes.string,
    style: PropTypes.shape(),
    value: PropTypes.string,
  };

  static defaultProps = {
    title: null,
    style: null,
    value: null,
  };

  static styles = {
    modal: {
      flex: 1,
    },
    spinner: {
      flex: 1,
    },
    modalWrapper: {
      flex: 1,
    },
    modalContainer: {
      backgroundColor: COLOR_PRIMARY,
      position: 'absolute',
      transform: [{ rotate: '-90deg' }],
      flexDirection: 'row',
    },
    modalSubContainer: {
      flexDirection: 'column',
      flex: 1,
    },
    modalStatusBar: {
      flexBasis: STATUS_BAR,
      backgroundColor: COLOR_PRIMARY,
      zIndex: 50,
      flex: 0,
    },
    navBar: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 0,
      flexBasis: HEIGHT_HEADER + 10,
      flexDirection: 'row',
      backgroundColor: COLOR_PRIMARY,
      zIndex: 50,
    },
    title: {
      flex: 1,
      fontSize: 18,
      color: 'white',
      textAlign: 'center',
    },
    button: {
      flex: 0,
      flexDirection: 'row',
      paddingHorizontal: 12,
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLOR_PRIMARY,
    },
    capture: {
      flex: 1,
      padding: 0,
    },
    captureContainer: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    dropBox: {
      height: 80,
      backgroundColor: '#f5f5f5',
      borderColor: '#cccccc',
      borderStyle: 'dashed',
      borderWidth: 1,
      borderRadius: 2,
      ...padding(1),
      ...margin(8, 0),
    },
    preview: {
      flex: 1,
      resizeMode: 'contain',
    },
  };

  constructor(props) {
    super(props);

    this.onPress = this.onPress.bind(this);
    this.setSignature = this.setSignature.bind(this);

    this.capture = null;
    this.state = {
      signature: props.value,
      displayModal: false,
      loading: false,
      width: 0,
      height: 0,
      empty: true,
    };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.save = this.save.bind(this);
  }

  trimDataURI(value) {
    if (value === null) {
      return null;
    }

    if (value.indexOf(this.constructor.DATA_URI_PREFIX) === 0) {
      return value.slice(this.constructor.DATA_URI_PREFIX.length);
    }
  }

  /**
   * On box pressed
   */
  onPress() {
    this.showModal();
  }

  /**
   * On signature saved
   *
   * @param {Object} result
   */
  onSave(result) {
    const { encoded } = result;

    this.setSignature(encoded ? `${this.constructor.DATA_URI_PREFIX}${encoded}` : null);
    this.setState({ loading: false });
    this.hideModal();
  }

  onDrag() {
    this.setState({ empty: false });
  }

  onLayout(event) {
    const { width, height } = event.nativeEvent.layout;

    this.setState({ width, height });
  }

  /**
   * Set the signature
   *
   * @param {String} signature Base 64 image
   */
  setSignature(signature) {
    this.setState({ signature });
    this.props.onSignature(signature, this);
  }

  getDimensions() {
    const { width, height } = this.state;

    return {
      width: height,
      height: width,
      top: (height - width) / 2,
      left: (width - height) / 2,
    };
  }

  /**
   * Display modal
   */
  showModal() {
    this.setState({ displayModal: true, empty: true });
  }

  /**
   * Hide modal
   */
  hideModal() {
    this.setState({ displayModal: false });
  }

  /**
   * Save the signature as it is
   */
  save() {
    if (this.state.loading) {
      return;
    }

    this.setState({ loading: true });

    if (this.state.empty) {
      this.capture.resetImage();
      this.onSave({ encoded: null });
    } else {
      this.capture.saveImage();
    }
  }

  /**
   * Render the signature
   *
   * @return {Component}
   */
  renderSignature() {
    const { signature } = this.state;

    if (!signature) {
      return <View />;
    }

    return <Image style={SignatureBox.styles.preview} source={{ uri: signature }} />;
  }

  /**
   * Render capture screen
   *
   * @return {Component}
   */
  renderCapture() {
    return (
      <SignatureCapture
        ref={capture => {
          this.capture = capture;
        }}
        onSaveEvent={this.onSave}
        onDragEvent={this.onDrag}
        style={SignatureBox.styles.capture}
        showNativeButtons={false}
        showTitleLabel={false}
        saveImageFileInExtStorage={false}
      />
    );
  }

  renderModalContent() {
    const { styles } = SignatureBox;

    if (!this.state.width) {
      return <Loader style={styles.spinner} />;
    }

    const { title } = this.props;
    const { signature, loading } = this.state;

    return (
      <View style={{ ...styles.modalContainer, ...this.getDimensions() }}>
        <View style={styles.modalSubContainer}>
          <View style={styles.navBar}>
            <NavigationButton style={styles.button} icon="times" onPress={this.hideModal} testID="close" />
            <Text style={styles.title} styleName="subtitle">
              {title}
            </Text>
            <NavigationButton
              loading={loading}
              style={styles.button}
              label={I18n.t(signature ? 'common.reset' : 'common.ok')}
              onPress={this.save}
              testID="validate"
            />
          </View>
          <View style={styles.captureContainer}>{this.renderCapture()}</View>
        </View>
        <View style={styles.modalStatusBar} />
      </View>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { style } = this.props;
    const { displayModal } = this.state;
    const { styles } = SignatureBox;

    return (
      <View style={style}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={displayModal}
          style={styles.modal}
          onRequestClose={this.hideModal}
          supportedOrientations={['portrait']}
        >
          <View style={styles.modalWrapper} onLayout={this.onLayout}>
            {this.renderModalContent()}
          </View>
        </Modal>
        <TouchableHighlight underlayColor="#cccccc" style={styles.dropBox} onPress={throttle(this.onPress)}>
          {this.renderSignature()}
        </TouchableHighlight>
      </View>
    );
  }
}

export default SignatureBox;
