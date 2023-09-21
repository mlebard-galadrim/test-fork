import React from 'react';
import FormAbstract from './FormAbstract';
import BlockTextInput from './BlockTextInput';

class TextInput extends FormAbstract {
  /**
   * @inheritdoc
   */
  renderComponent(props) {
    const { styles } = FormAbstract;
    const { inputStyle, ...remainingProps } = props;

    return (
      <BlockTextInput
        style={{
          ...styles.input,
          ...styles.text,
          ...inputStyle,
        }}
        {...remainingProps}
      />
    );
  }
}

export default TextInput;
