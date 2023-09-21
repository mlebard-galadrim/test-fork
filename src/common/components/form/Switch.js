import React from 'react';
import PropTypes from 'prop-types';
import { Switch as RNSwitch, View } from 'react-native';
import FormAbstract from './FormAbstract';

class Switch extends FormAbstract {
  static propTypes = {
    onValueChange: PropTypes.func.isRequired,
    value: PropTypes.bool.isRequired,
  };

  /**
   * {@inheritdoc}
   */
  renderComponent(props) {
    const { styles } = Switch;

    return (
      <View style={styles.input}>
        <RNSwitch {...props} />
      </View>
    );
  }
}

export default Switch;
