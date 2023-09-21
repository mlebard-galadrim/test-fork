import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Text } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import View from 'k2/app/modules/common/components/View';
import { get } from 'k2/app/container';
import Leak from '../models/Leak';
import MainListView from '../../common/components/list/MainListView';
import { COLOR_UNDERLAY, COLOR_SUCCESS } from '../../common/styles/vars';
import { iconLeak } from '../../../assets/icons';

class LeakList extends Component {
  static propTypes = {
    leaks: PropTypes.arrayOf(PropTypes.instanceOf(Leak)).isRequired,
    style: PropTypes.shape(),
    noDataContent: MainListView.propTypes.noDataContent,
  };

  static defaultProps = {
    style: {},
    noDataContent: 'scenes.intervention.leak_detection_shunt.list:empty',
  };

  static styles = {
    wrapper: {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    icon: {
      flex: 0,
      padding: 0,
      margin: 0,
      marginRight: 5,
      color: COLOR_SUCCESS,
    },
    image: {
      flex: 0,
      padding: 0,
      margin: 0,
      marginRight: 5,
      width: 30,
      height: 30,
    },
    locationText: {
      flex: 1,
      marginRight: 5,
    },
    noComponent: {
      flex: 0,
      fontSize: 13,
    },
    component: {
      container: {
        flex: 0,
      },
      title: {
        flex: 1,
        fontSize: 13,
        textAlign: 'right',
      },
      side: {
        flex: 0,
        color: COLOR_UNDERLAY,
        fontSize: 12,
        textAlign: 'right',
      },
    },
  };

  constructor(props) {
    super(props);

    this.componentRepository = get('component_repository');

    this.renderLeakRow = this.renderLeakRow.bind(this);
    this.renderComponent = this.renderComponent.bind(this);
  }

  /**
   * @param {Leak} leak
   *
   * @return {View}
   */
  renderLeakRow(leak) {
    const { styles } = this.constructor;
    const { uuid, repaired } = leak;

    return (
      <View styleName="horizontal" style={styles.wrapper} key={`leak-${uuid}`}>
        {repaired ? (
          <Icon size={30} name="check" style={styles.icon} />
        ) : (
          <Image style={styles.image} source={iconLeak} />
        )}
        <Text style={styles.locationText} ellipsizeMode="tail" numberOfLines={1}>
          {leak.location || I18n.t('scenes.intervention.leak_detection_shunt.no:location')}
        </Text>
        {this.renderComponent(leak)}
      </View>
    );
  }

  /**
   * @param {Leak} leak
   *
   * @return {String}
   */
  renderComponent(leak) {
    const { styles } = this.constructor;
    const component = leak.componentUuid ? this.componentRepository.find(leak.componentUuid) : null;

    if (!component) {
      return <Text style={styles.noComponent}>{I18n.t('components.intervention.leak_list.out_of_component')}</Text>;
    }

    const { nature, mark, barcode } = component;

    return (
      <View style={styles.component.container}>
        <Text style={styles.component.title}>{nature.designation.toString()}</Text>
        <Text style={styles.component.side}>{mark || barcode}</Text>
      </View>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { leaks, style, noDataContent } = this.props;

    return (
      <MainListView
        data={leaks}
        renderContent={this.renderLeakRow}
        icon={null}
        style={style}
        noDataContent={noDataContent}
      />
    );
  }
}

export default LeakList;
