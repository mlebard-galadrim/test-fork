import React from 'react';
import { TextInput } from 'react-native';

BlockTextInput.defaultProps = {
  ...TextInput.defaultProps,
  autoCorrect: false,
  autoCapitalize: 'none',
  clearButtonMode: 'while-editing',
  underlineColorAndroid: 'transparent',
  style: {},
};

function BlockTextInput({ ...remainingProps }) {
  return <TextInput {...remainingProps} />;
}

export default BlockTextInput;
