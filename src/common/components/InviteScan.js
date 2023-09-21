import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { ImageBackground, Dimensions, View } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Button } from './form';
import WrapperView from './WrapperView';
import { COLOR_PRIMARY, GUTTER } from '../styles/vars';
import { margin } from '../styles/utils';
import backgroundImage from 'k2/app/assets/scan/round_gradient.png';

const { width } = Dimensions.get('window');

/**
 * Invite Scan
 */
class InviteScan extends Component {
  static propTypes = {
    children: PropTypes.node,
    onMissingCode: PropTypes.func.isRequired,
    onScanCode: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
  };

  static defaultProps = {
    children: null,
  };

  static styles = {
    wrapper: {
      backgroundColor: COLOR_PRIMARY,
      justifyContent: 'flex-start',
    },
    image: {
      width,
      height: width,
      marginTop: -40,
    },
    button: {
      justifyContent: 'center',
      width,
      height: width,
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0,
    },
    icon: {
      alignSelf: 'center',
      padding: 0,
    },
    title: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: '#fff',
      marginTop: -3 * GUTTER,
      marginBottom: GUTTER,
    },
    buttonInline: {
      justifyContent: 'center',
      alignSelf: 'center',
      flexGrow: 1,
      backgroundColor: 'transparent',
      borderWidth: 0,
      padding: 0,
    },
    buttonInlineText: {
      color: '#fff',
      fontSize: 18,
      textDecorationLine: 'underline',
    },
    content: {
      ...margin(GUTTER, GUTTER * 2),
    },
  };

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { children, onMissingCode, onScanCode, title } = this.props;

    return (
      <WrapperView full noNavbar style={styles.wrapper}>
        <ImageBackground style={styles.image} source={backgroundImage}>
          <Button onPress={onScanCode} style={styles.button}>
            <Icon style={styles.icon} name="camera" size={50} color="#EEE" />
          </Button>
        </ImageBackground>
        <Text style={styles.title} styleName="title">
          {title}
        </Text>
        {children && <View style={styles.content}>{children}</View>}
        <Button style={styles.buttonInline} onPress={onMissingCode}>
          <Text style={styles.buttonInlineText}>{I18n.t('scenes.container.invite_scan.no_barcode')}</Text>
        </Button>
      </WrapperView>
    );
  }
}

export default InviteScan;
