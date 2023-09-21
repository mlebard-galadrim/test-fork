import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Text from 'k2/app/modules/common/components/Text';
import View from 'k2/app/modules/common/components/View';
import ComponentModel from '../models/Component';
import LeakModel from '../../intervention/models/Leak';
import MainListView from '../../common/components/list/MainListView';
import { COLOR_UNDERLAY } from '../../common/styles/vars';

class ComponentList extends Component {
  static propTypes = {
    components: PropTypes.arrayOf(PropTypes.instanceOf(ComponentModel)).isRequired,
    leaks: PropTypes.arrayOf(PropTypes.instanceOf(LeakModel)),
    onPressItem: PropTypes.func,
  };

  static defaultProps = {
    leaks: [],
    onPressItem: null,
  };

  static styles = {
    title: {
      flex: 1,
    },
    subtitle: {
      flex: 0,
    },
    side: {
      flex: 0,
      color: COLOR_UNDERLAY,
    },
  };

  constructor(props) {
    super(props);

    this.renderItemComponent = this.renderItemComponent.bind(this);
  }

  /**
   * @param {Component} component
   */
  renderItemComponent(component) {
    const { styles } = ComponentList;
    const { uuid, nature, mark, barcode, designation } = component;

    return (
      <View key={uuid}>
        <View styleName="horizontal">
          <Text style={styles.title}>{nature.designation.toString()}</Text>
          <Text styleName="caption" style={styles.side}>
            {mark || barcode}
          </Text>
        </View>
        <Text styleName="caption" style={styles.subtitle}>
          {designation}
        </Text>
      </View>
    );
  }

  render() {
    const { onPressItem, components, leaks, ...props } = this.props;

    return (
      <MainListView
        data={components}
        renderContent={this.renderItemComponent}
        onPressItem={onPressItem}
        isDisabled={component => component.isLeaking(leaks)}
        {...props}
      />
    );
  }
}

export default ComponentList;
