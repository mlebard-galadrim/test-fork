import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, Image, ImageBackground, Text, View } from 'react-native';
import { fixed } from 'k2/app/modules/common/utils/filterUtils';
import backgroundImage from 'k2/app/assets/gauge/background.png';
import pointerImage from 'k2/app/assets/gauge/pointer.png';
import { padding } from 'k2/app/modules/common/styles/utils';

/**
 * Gauge
 */
class Gauge extends Component {
  static GAUGE_SIZE = 246;
  static TITLE_HEIGHT = 14 + 10 * 2;

  static propTypes = {
    value: PropTypes.number.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    style: PropTypes.shape(),
    title: PropTypes.string,
  };

  static defaultProps = {
    style: {},
    min: 0,
    max: 0,
    title: null,
  };

  static styles = {
    container: {
      height: Gauge.GAUGE_SIZE / 2 + 5,
      overflow: 'hidden',
      padding: 0,
    },
    background: {
      width: Gauge.GAUGE_SIZE,
      height: Gauge.GAUGE_SIZE,
    },
    title: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: 'transparent',
      fontSize: 14,
      lineHeight: 14,
      height: Gauge.TITLE_HEIGHT,
      ...padding(10, 0),
    },
    pointer: {
      width: Gauge.GAUGE_SIZE,
      height: Gauge.GAUGE_SIZE,
    },
    labelContainer: {
      marginTop: -(Gauge.GAUGE_SIZE / 2) - 30,
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'transparent',
    },
    label: {
      flex: 0,
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: 'transparent',
      fontSize: 20,
      flexBasis: Gauge.GAUGE_SIZE - 34,
    },
    labelMin: {
      flex: 1,
      color: '#eeeeee',
      fontWeight: 'bold',
      fontSize: 10,
      paddingTop: 20,
      textAlign: 'right',
    },
    labelMax: {
      textAlign: 'left',
    },
  };

  constructor(props) {
    super(props);

    this.animate = this.animate.bind(this);

    this.animation = new Animated.Value(0);
    this.state = {
      value: 0,
    };
  }

  /**
   * {@inheritdoc}
   */
  componentDidMount() {
    this.setValue(this.props.value);
  }

  /**
   * {@inheritdoc}
   */
  componentDidUpdate(prevProps) {
    const { value } = this.props;

    if (prevProps.value !== value) {
      this.setValue(value);
    }
  }

  /**
   * Get rotation angle
   *
   * @param {Number} min
   * @param {Number} max
   *
   * @return {String}
   */
  getRotation(min, max) {
    if (!max) {
      return '-45deg';
    }

    return this.animation.interpolate({
      inputRange: [min, max],
      outputRange: ['10deg', '170deg'],
    });
  }

  /**
   * Set current value
   *
   * @param {Number} value
   */
  setValue(value) {
    const { min, max } = this.props;

    this.setState({ value: Math.min(Math.max(value, min), max) }, this.animate);
  }

  /**
   * Launch animation
   */
  animate(toValue = this.state.value) {
    Animated.timing(this.animation, {
      toValue,
      duration: 600,
      easing: Easing.inOut(Easing.cubic),
    }).start();
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { value } = this.state;
    const { min, max, title } = this.props;
    const { styles } = Gauge;
    const { paddingTop, paddingBottom } = this.props.style;
    const computedHeight = (paddingTop || 0) + (paddingBottom || 0) + styles.container.height;
    const rotation = this.getRotation(min, max);

    return [
      title && (
        <Text key="gauge_title" style={styles.title}>
          {title}
        </Text>
      ),
      <View
        key="gauge"
        style={{
          ...styles.container,
          ...this.props.style,
          height: computedHeight,
        }}
      >
        <ImageBackground style={styles.background} source={backgroundImage}>
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Image style={styles.pointer} source={pointerImage} />
          </Animated.View>
        </ImageBackground>
        <View style={styles.labelContainer}>
          <Text style={styles.labelMin}>{max ? min : null}</Text>
          <Text style={styles.label}>{max ? `${fixed(value)}kg` : I18n.t('common.unknown')}</Text>
          <Text style={{ ...styles.labelMin, ...styles.labelMax }}>{fixed(max) || null}</Text>
        </View>
      </View>,
    ];
  }
}

export default Gauge;
