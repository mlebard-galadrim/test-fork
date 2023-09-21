import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, TouchableHighlight, Image, Text, View } from 'react-native';
import { get } from 'k2/app/container';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { COLOR_SECONDARY, COLOR_UNDERLAY, COLOR_LIGHT_BG, COLOR_PLACEHOLDER } from 'k2/app/modules/common/styles/vars';
import { margin } from 'k2/app/modules/common/styles/utils';
import { iconLeak } from 'k2/app/assets/icons';
import Installation from '../models/Installation';

/**
 * SelectInstallation scene
 */
export default class AbstractSelectInstallation extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    selectInstallation: PropTypes.func.isRequired,
    installations: PropTypes.arrayOf(PropTypes.instanceOf(Installation)).isRequired,
    siteName: PropTypes.string.isRequired,
    showLeakingAsDisabled: PropTypes.bool,
  };

  static defaultProps = {
    showLeakingAsDisabled: false,
  };

  static styles = {
    button: {
      justifyContent: 'center',
      height: 70,
      padding: 10,
      ...margin(10, 0),
      borderRadius: 6,
      backgroundColor: COLOR_LIGHT_BG,
    },
    disabled: {
      color: COLOR_PLACEHOLDER,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLOR_SECONDARY,
      marginBottom: 5,
    },
    reference: {
      fontSize: 15,
      color: COLOR_SECONDARY,
    },
    iconLeak: {
      flex: 0,
      padding: 0,
      margin: 0,
      marginLeft: 10,
      width: 20,
      height: 20,
    },
    row: {
      backgroundColor: 'transparent',
      margin: 0,
      padding: 0,
    },
  };

  constructor(props) {
    super(props);

    this.validator = get('validator');

    this.renderRow = this.renderRow.bind(this);
    this.onPressInstallation = this.onPressInstallation.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  componentWillUnmount() {
    this.props.selectInstallation(null);
  }

  /**
   * @param {InstallationModel} installation
   */
  onPressInstallation(installation) {
    const { selectInstallation, next } = this.props;

    this.validator.validate(this.validator.isInstallationValid(installation), () => {
      selectInstallation(installation);
      next();
    });
  }

  /**
   * @param {InstallationModel} installation
   *
   * @return {TouchableHighlight}
   */
  renderRow({ item }) {
    const { styles } = this.constructor;
    const { showLeakingAsDisabled } = this.props;
    const { name, leaking, reference, id } = item;
    const leakStyle = leaking && showLeakingAsDisabled ? styles.disabled : {};

    return (
      <TouchableHighlight
        key={`installation-${item.id}`}
        style={styles.button}
        underlayColor={COLOR_UNDERLAY}
        onPress={() => this.onPressInstallation(item)}
      >
        <View style={styles.row}>
          <View>
            <Text ellipsizeMode="tail" numberOfLines={1} style={{ ...styles.name, ...leakStyle }}>
              {name}
            </Text>
            <Text ellipsizeMode="tail" numberOfLines={1} style={{ ...styles.reference, ...leakStyle }}>
              {reference || id}
            </Text>
          </View>
          {leaking && <Image style={styles.iconLeak} source={iconLeak} />}
        </View>
      </TouchableHighlight>
    );
  }

  /**
   * Render children
   *
   * @return {Component}
   */
  renderChildren() {
    return <FlatList key="list" data={this.props.installations} renderItem={this.renderRow} />;
  }

  /**
   * {@inheritdoc}
   */
  render() {
    return (
      <WrapperView title={I18n.t('scenes.installation.installation.title')} subtitle={this.props.siteName}>
        {this.renderChildren()}
      </WrapperView>
    );
  }
}
