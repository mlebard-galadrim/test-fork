import React from 'react';
import FormAbstract from './FormAbstract';
import BlockFloatInput from './BlockFloatInput';

class FloatInput extends FormAbstract {
  static parse(value, emptyAsNull = false) {
    return BlockFloatInput.parse(value, emptyAsNull);
  }

  /**
   * {@inheritdoc}
   */
  renderComponent(props) {
    const { styles } = FormAbstract;
    const { inputStyle, value, defaultValue, ...remainingProps } = props;
    const style = {
      ...styles.input,
      ...styles.text,
      ...inputStyle,
    };

    return (
      <BlockFloatInput
        style={style}
        value={typeof value === 'number' ? value.toString() : value}
        defaultValue={defaultValue}
        {...remainingProps}
      />
    );
  }
}

export default FloatInput;
