import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, Image, Platform, View } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import I18n from 'i18n-js';
import { RNCamera as Camera } from 'react-native-camera';
import sightImage from 'k2/app/assets/scan/sight.png';

/**
 * Scan
 */
class Scan extends Component {
  static propTypes = {
    onCode: PropTypes.func.isRequired,
    children: PropTypes.node,
    style: PropTypes.shape(),
    active: PropTypes.bool.isRequired, // Is the component active and should render the camera
  };

  static defaultProps = {
    active: true,
    children: null,
    style: {},
  };

  static styles = {
    preview: {
      flexDirection: 'column',
      justifyContent: 'center',
      flex: 1,
      backgroundColor: 'black',
    },
    overlay: {
      borderColor: 'rgba(74, 74, 74, 0.4)',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sight: {
      width: 472 / 2,
      height: 472 / 2,
    },
    flash: {
      success: 'rgba(88, 127, 99, 0.5)',
      warning: 'rgba(185, 137, 86, 0.5)',
      info: 'rgba(0, 111, 140, 0.5)',
      error: 'rgba(169, 79, 76, 0.5)',
    },
    alert: {
      padding: 20,
      flex: 1,
      textAlign: 'center',
    },
    childrenContainer: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1, // Required on Android for touchable elements inside an absolute container to react on press.
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  };

  constructor() {
    super();

    this.state = {
      overlay: {},
      bounceValue: new Animated.Value(0),
      flashColor: Scan.styles.flash.success,
    };

    this.code = null;

    this.onCode = this.onCode.bind(this);
    this.onLayout = this.onLayout.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.active && !this.props.active) {
      this.code = null;
    }
  }

  onLayout(event) {
    const { width, height } = event.nativeEvent.layout;
    const xBorder = (width - Scan.styles.sight.width) / 2;
    const yBorder = (height - Scan.styles.sight.height) / 2;

    const overlay = {
      width,
      height,
      borderTopWidth: Math.ceil(yBorder),
      borderBottomWidth: Math.floor(yBorder),
      borderLeftWidth: Math.ceil(xBorder),
      borderRightWidth: Math.floor(xBorder),
    };

    this.setState({ overlay });
  }

  /**
   * On code
   *
   * @param {Object} result
   */
  onCode(result) {
    const code = result.data;

    if (code !== this.code) {
      this.code = code;
      this.props.onCode(code);

      if (this.resetTimemout) {
        clearTimeout(this.resetTimemout);
      }

      // reset scanned code after 3 second
      this.resetTimemout = setTimeout(() => {
        this.timeout = this.code = null;
      }, 3000);
    }
  }

  /**
   * 📸
   */
  flash(flashColor = Scan.styles.flash.success) {
    const { bounceValue } = this.state;

    bounceValue.setValue(0);

    Animated.sequence([
      Animated.timing(bounceValue, {
        useNativeDriver: false,
        toValue: 1,
        duration: 200,
        easing: Easing.elastic(2),
      }),
      Animated.timing(bounceValue, {
        useNativeDriver: false,
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
      }),
    ]).start();

    this.setState({ flashColor });
  }

  renderUnauthorized() {
    const { styles } = this.constructor;
    const { style } = this.props;

    return (
      <View style={{ ...styles.preview, ...style }}>
        <Text style={styles.alert}>{I18n.t('common.camera.unauthorized')}</Text>
      </View>
    );
  }

  renderInactive() {
    const { styles } = this.constructor;
    const { style } = this.props;

    return <View style={{ ...styles.preview, ...style }} />;
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { style, children, active } = this.props;
    const { overlay, flashColor, bounceValue } = this.state;
    const borderColor = bounceValue.interpolate({
      inputRange: [0, 1],
      outputRange: [styles.overlay.borderColor, flashColor],
    });

    if (!active) {
      return this.renderInactive();
    }

    const content = [
      <Animated.View key="overlay" style={{ ...styles.overlay, ...overlay, borderColor }}>
        <Image style={styles.sight} source={sightImage} />
      </Animated.View>,
      <View key="children" style={styles.childrenContainer}>
        {children}
      </View>,
    ];

    return (
      <Camera
        style={{ ...styles.preview, ...style }}
        notAuthorizedView={this.renderUnauthorized()}
        pendingAuthorizationView={this.renderInactive()}
        onBarCodeRead={this.onCode}
        // Climalife official support of barcodes is: code128, code39, QR, DM, EAN13 (& EAN14 later)
        // We accept all bar code types as we don't know what competitor uses for their containers.
        // Trackdéchets uses QR Codes for its bordereaux numbers.
        /*barCodeTypes={[Camera.Constants.BarCodeType.code128]}*/
        onLayout={this.onLayout}
        captureAudio={false}
      >
        {Platform.OS === 'ios' ? content : content.reverse()}
      </Camera>
    );
  }
}

export default Scan;
