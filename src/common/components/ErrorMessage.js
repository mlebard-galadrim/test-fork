import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

/**
 * Error Message
 */
class ErrorMessage extends Component {
  static propTypes = {
    message: PropTypes.string,
    isWarning: PropTypes.bool,
  };

  static defaultProps = {
    isWarning: false,
  };

  static styles = {
    text: {
      alignSelf: 'flex-start',
      marginTop: 5,
      color: '#cc453b',
    },
    warning: {
      color: '#ff9600',
    },
  };

  /**
   * Create an error message (only if the error is present)
   *
   * @param {String|null}  message
   * @param {Boolean} isWarning
   *
   * @return {ErrorMessage|null}
   */
  static create(message = null, isWarning = false) {
    if (!message) {
      return null;
    }

    return <ErrorMessage isWarning={isWarning} message={message} />;
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = ErrorMessage;
    const { isWarning } = this.props;
    const textStyles = {
      ...styles.text,
      ...(isWarning ? styles.warning : {}),
    };

    return <Text style={textStyles}>{this.props.message}</Text>;
  }
}

export default ErrorMessage;
