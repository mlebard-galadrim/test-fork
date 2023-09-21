import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { View, ScrollView } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import { COLOR_PRIMARY, GUTTER } from '../styles/vars';

class WrapperView extends Component {
  static propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    style: PropTypes.shape(),
    full: PropTypes.bool,
    noNavbar: PropTypes.bool,
    scrollable: PropTypes.bool,
    keyboardAware: PropTypes.bool,
  };

  static defaultProps = {
    style: {},
    children: null,
    title: null,
    subtitle: null,
    full: false,
    noNavbar: false,
    scrollable: false,
    keyboardAware: false,
  };

  static styles = {
    wrapper: {
      paddingHorizontal: GUTTER,
      flex: 1,
    },
    title: {
      textAlign: 'center',
      margin: GUTTER,
    },
    subtitle: {
      fontWeight: 'bold',
      textAlign: 'center',
      color: COLOR_PRIMARY,
      marginBottom: 20,
    },
    full: {
      marginHorizontal: 0,
    },
    wrapperFull: {
      paddingHorizontal: 0,
    },
    noNavbar: {
      marginTop: 0,
    },
  };

  /**
   * Apply full to the given style
   *
   * @param {Object} style
   *
   * @return {Object}
   */
  applyFull(style, reset = WrapperView.styles.full) {
    if (this.props.full) {
      return style;
    }

    return { ...style, ...reset };
  }

  /**
   * Render title
   *
   * @return {Title|null}
   */
  renderTitle() {
    const { title } = this.props;
    const { styles } = WrapperView;

    if (title === null) {
      return null;
    }

    return (
      <Text styleName="title" testID="title" style={this.applyFull(styles.title)}>
        {title}
      </Text>
    );
  }

  /**
   * Render subtitle
   *
   * @return {Title|null}
   */
  renderSubtitle() {
    const { subtitle } = this.props;
    const { styles } = WrapperView;

    if (subtitle === null) {
      return null;
    }

    return (
      <Text styleName="subtitle" testID="subtitle" style={this.applyFull(styles.subtitle)}>
        {subtitle}
      </Text>
    );
  }

  resolveContainer() {
    const { scrollable, keyboardAware } = this.props;

    if (keyboardAware) {
      return KeyboardAwareScrollView;
    }

    if (scrollable) {
      return ScrollView;
    }

    return View;
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { full, noNavbar, style, contentContainerStyle } = this.props;
    const { styles } = this.constructor;
    const Container = this.resolveContainer();
    const wrapperStyle = {
      ...styles.wrapper,
      ...(full ? styles.wrapperFull : {}),
      ...(noNavbar ? styles.noNavbar : {}),
    };

    return (
      <Container style={{ ...wrapperStyle, ...style }} contentContainerStyle={contentContainerStyle}>
        {this.renderTitle()}
        {this.renderSubtitle()}
        {this.props.children}
      </Container>
    );
  }
}

export default WrapperView;
