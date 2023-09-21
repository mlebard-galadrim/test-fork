import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import Icon from 'k2/app/modules/common/components/Icon';
import { throttle } from '../utils/NavigationUtils';
import { COLOR_PRIMARY, COLOR_UNDERLAY } from '../styles/vars';

class Definition extends Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.node,
    linkTo: PropTypes.func,
  };

  static defaultProps = {
    value: null,
    linkTo: null,
  };

  static styles = {
    definition: {
      minHeight: 15,
      flexDirection: 'row',
      marginBottom: 10,
    },
    term: {
      flex: 1,
      flexGrow: 0.5,
      flexBasis: 110,
      fontSize: 13,
      fontWeight: '500',
      paddingRight: 5,
      color: '#333',
      alignSelf: 'center',
    },
    value: {
      flex: 2,
      fontSize: 13,
      alignSelf: 'center',
    },
    linkValue: {
      flex: 2,
    },
    wrapperLink: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textLink: {
      paddingTop: 5,
      fontSize: 13,
      color: COLOR_PRIMARY,
    },
    iconLink: {
      marginTop: 0,
      color: COLOR_UNDERLAY,
    },
  };

  /**
   * Render value of definition
   *
   * @return {Text|TouchableOpacity}
   */
  renderValue() {
    const { styles } = Definition;
    const { linkTo, value } = this.props;

    if (linkTo) {
      return (
        <TouchableOpacity onPress={throttle(linkTo)} style={styles.linkValue}>
          <View style={styles.wrapperLink}>
            <Text testID="value" style={styles.textLink}>
              {value}
            </Text>
            <Icon style={styles.iconLink} name="chevron-right" />
          </View>
        </TouchableOpacity>
      );
    }

    if (!['object', 'function'].includes(typeof value)) {
      return (
        <Text testID="value" style={styles.value}>
          {value}
        </Text>
      );
    }

    return value;
  }

  render() {
    const { styles } = Definition;
    const { label } = this.props;

    return (
      <View style={styles.definition}>
        <Text testID="label" style={styles.term}>
          {label}
        </Text>
        {this.renderValue()}
      </View>
    );
  }
}

export default Definition;
