import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import { GUTTER } from 'k2/app/modules/common/styles/vars';
import { padding } from 'k2/app/modules/common/styles/utils';

export default class Option extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    numberOfLines: PropTypes.number,
    ellipsizeMode: PropTypes.string,
  };

  static defaultProps = {
    numberOfLines: 1,
    ellipsizeMode: 'tail',
  };

  static styles = {
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#ebebeb',
      borderRadius: 5,
      marginVertical: GUTTER,
      ...padding(8, 16),
    },
    label: {
      flex: 1,
      fontSize: 13,
      color: '#4e92b4',
      fontWeight: 'bold',
      alignSelf: 'center',
      marginRight: GUTTER,
    },
  };

  render() {
    const { styles } = this.constructor;
    const { label, children, numberOfLines, ellipsizeMode } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.label} numberOfLines={numberOfLines} ellipsizeMode={ellipsizeMode}>
          {label}
        </Text>
        {children}
      </View>
    );
  }
}
