import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import { padding } from '../../styles/utils';
import { COLOR_ERROR, COLOR_WARNING, COLOR_PLACEHOLDER, COLOR_PRIMARY } from '../../styles/vars';

class FormAbstract extends Component {
  static propTypes = {
    error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    warning: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    title: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    style: PropTypes.shape(),
    labelStyle: PropTypes.shape(),
    inputStyle: PropTypes.shape(),
    unit: PropTypes.string,
    children: PropTypes.node,
    optional: PropTypes.bool,
    disabled: PropTypes.bool,
    hideStripe: PropTypes.bool,
  };

  static defaultProps = {
    error: false,
    warning: false,
    placeholder: '',
    style: {},
    labelStyle: {},
    inputStyle: {},
    unit: null,
    children: null,
    optional: false,
    disabled: false,
    hideStripe: false,
  };

  static styles = {
    wrapper: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 0,
      borderStyle: 'solid',
      // Android does not support well overriding borderColor with single side rules:
      // https://github.com/facebook/react-native/issues/19981
      // Let's always be specific:
      borderBottomColor: '#eee',
      borderBottomWidth: 1,
      borderLeftWidth: 3,
      marginTop: -1,
      ...padding(5, 8),
    },
    error: {
      // Android does not support well overriding borderColor with single side rules:
      // https://github.com/facebook/react-native/issues/19981
      // Let's always be specific:
      borderLeftColor: COLOR_ERROR,
      borderBottomColor: COLOR_ERROR,
    },
    warning: {
      borderLeftColor: COLOR_WARNING,
      borderBottomColor: COLOR_WARNING,
    },
    label: {
      flex: 1,
      flexGrow: 0,
      flexBasis: 110,
      fontSize: 13,
      fontWeight: '500',
      paddingRight: 5,
      color: '#000',
    },
    optional: {
      color: '#555',
    },
    input: {
      flex: 2,
      height: 30,
    },
    text: {
      flex: 1,
      fontSize: 13,
      ...padding(8, 0, 5),
    },
    unit: {
      flex: 0,
    },
    textError: {
      color: COLOR_ERROR,
    },
    errorContent: {
      fontSize: 13,
      ...padding(5, 8),
    },
    textWarning: {
      color: COLOR_WARNING,
    },
    warningContent: {
      fontSize: 13,
      ...padding(5, 8),
    },
    placeholder: {
      color: COLOR_PLACEHOLDER,
    },
  };

  constructor() {
    super();

    this.renderLabel = this.renderLabel.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
  }

  /**
   * Render label
   *
   * @return {Component|JSX.Element}
   */
  renderLabel() {
    const { styles } = this.constructor;
    const { title, optional, error, warning, labelStyle } = this.props;

    return (
      <Text
        style={{
          ...styles.label,
          ...(optional ? styles.optional : {}),
          ...(error ? styles.textError : {}),
          ...(warning ? styles.textWarning : {}),
          ...labelStyle,
        }}>
        {title}
      </Text>
    );
  }

  /**
   * Render the input
   *
   * @param {Object} props
   *
   * @return {Component|JSX.Element}
   */
  renderComponent(props) {
    throw new Error('A form input must implement "renderComponent" method.');
  }

  /**
   * Render a unit indicator
   *
   * @param {String} unit
   *
   * @return {Component|JSX.Element|null}
   */
  renderUnit(unit = null) {
    return unit && <Text style={FormAbstract.styles.unit}>{unit}</Text>;
  }

  /**
   * Render a modal (optional)
   *
   * @return {Component|JSX.Element|null}
   */
  renderModal() {
    return null;
  }

  render() {
    const { styles } = this.constructor;
    const { style, children, unit, error, warning, optional, ...props } = this.props;
    const isDisabled = props.hideStripe === true || props.editable === false || props.disabled === true;
    const wrapperStyle = {
      ...styles.wrapper,
      ...style,
      borderLeftColor: isDisabled ? 'transparent' : optional ? COLOR_PLACEHOLDER : COLOR_PRIMARY,
      ...(error ? styles.error : {}),
      ...(warning ? styles.warning : {}),
    };

    return (
      <View>
        <View style={wrapperStyle}>
          {this.renderModal()}
          {this.renderLabel()}
          {this.renderComponent(props)}
          {this.renderUnit(unit)}
          {children}
        </View>
        {typeof error === 'string' && <Text style={{ ...styles.errorContent, ...styles.textError }}>{error}</Text>}
        {typeof warning === 'string' && (
          <Text style={{ ...styles.warningContent, ...styles.textWarning }}>{warning}</Text>
        )}
      </View>
    );
  }
}

export default FormAbstract;
