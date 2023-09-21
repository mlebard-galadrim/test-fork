import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Container from '../models/Container';
import Fluid from '../../nomenclature/models/Fluid';
import { COLOR_PRIMARY, COLOR_SUCCESS, COLOR_UNDERLAY, COLOR_ERROR } from '../../common/styles/vars';

class ContainerIcon extends Component {
  static propTypes = {
    container: PropTypes.instanceOf(Container),
    fluid: PropTypes.instanceOf(Fluid),
    recycled: PropTypes.bool,
    forElimination: PropTypes.bool,
    load: PropTypes.number,
  };

  static defaultProps = {
    container: null,
    fluid: null,
    recycled: false,
    forElimination: false,
    load: 0,
  };

  static styles = {
    icon: {
      flex: 0,
      padding: 0,
      margin: 0,
      marginRight: 5,
    },
    iconColor: {
      default: COLOR_PRIMARY,
      unknown: COLOR_UNDERLAY,
      recycled: COLOR_SUCCESS,
      forElimination: COLOR_ERROR,
    },
  };

  /**
   * Get color
   *
   * @param {Container} container
   * @param {Boolean} recycled
   * @param {Boolean} forElimination
   *
   * @return {String}
   */
  static getColor(container = null, recycled = false, forElimination = false) {
    const { iconColor } = ContainerIcon.styles;

    if (container.competitor) {
      return iconColor.unknown;
    }

    if (recycled) {
      return iconColor.recycled;
    }

    if (forElimination) {
      return iconColor.forElimination;
    }

    return iconColor.default;
  }

  /**
   * Get icon
   *
   * @param {Container} container
   * @param {Number} load
   * @param {Fluid|null} fluid
   *
   * @return {String}
   */
  static getIcon(container = null, load = 0, fluid = null) {
    if (!container) {
      return 'battery-unknown';
    }

    const ratio = container.getRatio(load, fluid);

    if (ratio === null) {
      return 'battery-unknown';
    }

    const step = Math.floor(Math.min(Math.max(ratio, 0), 1) * 10);

    switch (step) {
      case 0:
        return 'battery-outline';

      case 10:
        return 'battery';

      default:
        return `battery-${step}0`;
    }
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles, getColor, getIcon } = ContainerIcon;
    const { container, recycled, forElimination, load, fluid } = this.props;

    return (
      <Icon
        size={20}
        name={getIcon(container, load, fluid)}
        style={{
          ...styles.icon,
          color: getColor(container, recycled, forElimination),
        }}
      />
    );
  }
}

export default ContainerIcon;
