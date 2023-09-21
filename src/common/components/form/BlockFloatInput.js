import React from 'react';
import { TextInput } from 'react-native';
import PropTypes from 'prop-types';

BlockFloatInput.propTypes = {
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default function BlockFloatInput({ defaultValue, ...props }) {
  return (
    <TextInput
      keyboardType="decimal-pad"
      autoCapitalize="none"
      defaultValue={typeof defaultValue === 'number' ? BlockFloatInput.formatFloat(defaultValue) : defaultValue}
      selectTextOnFocus
      autoCorrect={false}
      clearButtonMode="while-editing"
      underlineColorAndroid="transparent"
      {...props}
    />
  );
}

BlockFloatInput.floatParser = new RegExp('[^\\.\\d]', 'ig');

BlockFloatInput.parse = function (value, emptyAsNull = false) {
  if (emptyAsNull && value === '') {
    return null;
  }

  if (!value) {
    return 0;
  }

  return parseFloat(value.toString().replace(',', '.').replace(this.floatParser, '')) || 0;
};

/**
 * @param {Number|null} value
 * @param {Number} precision
 * @param {Number|String|null} defaultValue default value on null
 */
BlockFloatInput.formatFloat = function (value, precision = 2, defaultValue = 0) {
  if (value === null) {
    return defaultValue;
  }

  return (
    value
      .toFixed(precision)
      .toString()
      // Remove trailing 0 in decimals
      .replace(/\.?0*$/, '')
  );
};
