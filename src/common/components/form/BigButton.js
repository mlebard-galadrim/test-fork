import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import { throttle } from '../../utils/NavigationUtils';
import { GUTTER } from '../../styles/vars';

class BigButton extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    color: PropTypes.string,
    textColor: PropTypes.string,
    noBorder: PropTypes.bool,
    inline: PropTypes.bool,
    style: PropTypes.shape(),
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired,
  };

  static defaultProps = {
    color: null,
    disabledColor: 'rgba(255, 255, 255, 0.75)',
    textColor: 'white',
    loading: false,
    disabled: false,
    noBorder: false,
    inline: false,
    style: {},
  };

  static styles = {
    button: {
      alignSelf: 'stretch',
      alignItems: 'center',
      justifyContent: 'center',
      padding: GUTTER,
      borderWidth: 1,
      borderRadius: 30,
      borderColor: 'white',
    },
    text: {
      fontSize: 18,
    },
    disabledText: {
      opacity: 0.75,
    },
  };

  constructor() {
    super();

    this.renderContent = this.renderContent.bind(this);
  }

  /**
   * Generate content button
   */
  renderContent() {
    const { styles } = BigButton;
    const { color, textColor, label, loading, disabled, inline } = this.props;

    const textStyle = {
      ...styles.text,
      ...(disabled ? styles.disabledText : {}),
      color: (inline && color) || textColor,
      textDecorationLine: inline ? 'underline' : 'none',
    };

    if (loading) {
      return <ActivityIndicator size="small" color={textStyle.color} />;
    }

    return <Text style={textStyle}>{inline ? label : label.toUpperCase()}</Text>;
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = BigButton;
    const { color, disabledColor, style, loading, noBorder, inline, disabled, onPress, ...props } = this.props;

    const buttonStyle = {
      ...styles.button,
      ...style,
      ...(disabled ? { borderColor: disabledColor } : {}),
      borderWidth: noBorder || color || inline ? 0 : 1,
      backgroundColor: (!inline && color) || 'transparent',
    };

    return (
      <TouchableOpacity onPress={throttle(onPress)} disabled={loading || disabled} style={buttonStyle} {...props}>
        <View>{this.renderContent()}</View>
      </TouchableOpacity>
    );
  }
}

export default BigButton;
