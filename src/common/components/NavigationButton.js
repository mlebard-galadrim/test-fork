import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import Icon from 'k2/app/modules/common/components/Icon';
import { padding } from '../styles/utils';
import { throttle } from '../utils/NavigationUtils';
import { HEIGHT_HEADER, GUTTER, NAVBAR_FONT_SIZE, NAVBAR_LINE_HEIGHT, NAVBAR_ICON_SIZE } from '../styles/vars';

class NavigationButton extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    testID: PropTypes.string,
    icon: PropTypes.string,
    label: PropTypes.string,
    loading: PropTypes.bool,
    style: PropTypes.shape(),
    navbarItemStyle: PropTypes.shape(),
  };

  static defaultProps = {
    icon: null,
    label: null,
    testID: null,
    loading: false,
    style: null,
    navbarItemStyle: null,
  };

  static styles = {
    navbarItem: {
      textAlign: 'center',
      color: 'white',
      height: HEIGHT_HEADER,
      fontSize: NAVBAR_FONT_SIZE,
      lineHeight: NAVBAR_LINE_HEIGHT,
      ...padding((HEIGHT_HEADER - NAVBAR_LINE_HEIGHT) / 2, GUTTER),
    },
    navbarIconItem: {
      fontSize: NAVBAR_ICON_SIZE,
    },
  };

  renderContent() {
    const { styles } = NavigationButton;
    const { icon, label, loading, navbarItemStyle } = this.props;

    if (loading) {
      return <ActivityIndicator style={{ ...styles.navbarItem, ...navbarItemStyle }} color="white" />;
    }

    if (icon) {
      return (
        <Icon
          style={{
            ...styles.navbarItem,
            ...styles.navbarIconItem,
            ...navbarItemStyle,
          }}
          name={icon}
        />
      );
    }

    return <Text style={{ ...styles.navbarItem, ...navbarItemStyle }}>{label}</Text>;
  }

  render() {
    const { onPress, testID, style } = this.props;

    return (
      <TouchableOpacity style={style} onPress={throttle(onPress)} testID={testID}>
        <View>{this.renderContent()}</View>
      </TouchableOpacity>
    );
  }
}

export default NavigationButton;
