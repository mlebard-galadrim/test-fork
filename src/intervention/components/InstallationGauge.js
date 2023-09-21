import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import { get } from 'k2/app/container';
import InterventionType from '../models/InterventionType';
import Installation from '../../installation/models/Installation';
import ContainerLoad from '../models/ContainerLoad';
import { COLOR_LIGHT_BG, COLOR_SECONDARY, COLOR_UNDERLAY } from '../../common/styles/vars';
import { margin, padding } from '../../common/styles/utils';
import { fixed } from '../../common/utils/filterUtils';

class InstallationGauge extends Component {
  static propTypes = {
    interventionType: PropTypes.string.isRequired,
    installation: PropTypes.instanceOf(Installation).isRequired,
    containerLoads: PropTypes.arrayOf(PropTypes.instanceOf(ContainerLoad)).isRequired,
  };

  static styles = {
    gaugeInitialInfos: {
      height: 20,
      flexDirection: 'row',
      borderWidth: 1,
      borderTopWidth: 0,
      borderBottomWidth: 0,
      borderColor: COLOR_LIGHT_BG,
    },
    gaugeInfosText: {
      flex: 1,
      fontSize: 13,
      lineHeight: 20,
      color: COLOR_SECONDARY,
      ...padding(0, 5),
    },
    gaugeChart: {
      height: 20,
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: COLOR_LIGHT_BG,
    },
    gaugeLegend: {
      marginTop: 10,
    },
    installationState: {
      marginBottom: 5,
      fontSize: 13,
      textAlign: 'center',
    },
    initialLoad: {
      backgroundColor: '#FFE86F',
    },
    loadFilling: {
      backgroundColor: '#B8F374',
    },
    loadDrainage: {
      backgroundColor: '#F37474',
    },
    circuitLoad: {
      backgroundColor: '#F5F5F5',
    },
    legendRow: {
      flexDirection: 'row',
    },
    legendLine: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      ...margin(5, 10),
    },
    legendText: {
      fontSize: 13,
      fontWeight: '500',
    },
    legendSquare: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 12,
      height: 12,
      marginRight: 5,
      borderWidth: 1,
      borderColor: COLOR_UNDERLAY,
    },
    bicolor: {
      flex: 1,
      margin: 0,
      height: 10,
    },
    textRight: {
      textAlign: 'right',
    },
  };

  /**
   * Maximum quantity that can be loaded in the installation before the intervention
   */
  get nominalLoad() {
    return this.props.installation.primaryCircuit.nominalLoad;
  }

  /**
   * Total quantity present in the installation before the intervention
   */
  get initialLoad() {
    return this.props.installation.primaryCircuit.currentLoad;
  }

  /**
   * Sum of the quantity of all container loaded in the installation during the intervention
   */
  get containersLoad() {
    return this.props.containerLoads.reduce((total, container) => total + container.load, 0);
  }

  /**
   * Current total quantity present in the installation
   */
  get currentLoad() {
    return Math.max(this.initialLoad + this.containersLoad * (this.isFilling() ? 1 : -1), 0);
  }

  /**
   * New maximum quantity that can be loaded in the installation
   */
  get maxLoad() {
    return Math.max(this.nominalLoad, this.currentLoad);
  }

  get remainingLoad() {
    return Math.max(this.nominalLoad - this.currentLoad, 0);
  }

  get ratio() {
    return Math.min(Math.max(this.currentLoad / this.maxLoad, 0), 1);
  }

  isFilling() {
    return this.props.interventionType === InterventionType.FILLING;
  }

  /**
   * Convert load to flex
   *
   * @param {Number} load
   * @param {Number} total
   * @param {Number} precision
   *
   * @return {Number}
   */
  flex(load, total = this.containersLoad, precision = 100) {
    return Math.round((load / total) * precision);
  }

  /**
   * Render a legend item
   *
   * @param {String} type
   * @param {Number} load
   * @param {String[]|String} colors
   *
   * @return {Component}
   */
  renderLegend(type, load, colors) {
    const { legendLine, legendSquare, legendText, bicolor } = InstallationGauge.styles;

    return (
      <View style={legendLine}>
        <View style={legendSquare}>
          {(Array.isArray(colors) ? colors : [colors]).map(color => (
            <View key={color.backgroundColor} style={{ ...bicolor, ...color }} />
          ))}
        </View>
        <Text style={legendText}>
          {I18n.t(`scenes.intervention.installation_gauge.${type}`, {
            load: fixed(load),
          })}
        </Text>
      </View>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = InstallationGauge;
    const { interventionType } = this.props;
    const { remainingLoad, nominalLoad, maxLoad, initialLoad, currentLoad, containersLoad, ratio } = this;
    let nominalLoadLabel = `${fixed(maxLoad)}kg`;

    if (nominalLoad !== maxLoad) {
      nominalLoadLabel += ` (${fixed(nominalLoad)}kg)`;
    }

    return (
      <View>
        <View style={styles.gaugeInitialInfos}>
          <Text style={styles.gaugeInfosText}>0kg</Text>
          <Text style={{ ...styles.gaugeInfosText, ...styles.textRight }}>{nominalLoadLabel}</Text>
        </View>
        <View style={styles.gaugeChart}>
          <View
            style={{
              ...styles.initialLoad,
              flex: this.flex(this.isFilling() ? initialLoad : currentLoad),
            }}
          />
          <View
            style={{
              ...(this.isFilling() ? styles.loadFilling : styles.loadDrainage),
              flex: this.flex(containersLoad),
            }}
          />
          <View
            style={{
              ...styles.circuitLoad,
              flex: this.flex(maxLoad - (this.isFilling() ? currentLoad : initialLoad)),
            }}
          />
        </View>
        <View style={styles.gaugeLegend}>
          <Text style={styles.installationState}>
            {I18n.t('scenes.intervention.installation_gauge.title', {
              percent: Math.round(ratio * 100),
            })}
          </Text>
          <View style={styles.legendRow}>
            {this.renderLegend(
              'initial_load',
              initialLoad,
              [styles.initialLoad].concat(this.isFilling() ? [] : [styles.loadDrainage]),
            )}
            {this.renderLegend(
              `${interventionType}:load`,
              containersLoad,
              this.isFilling() ? styles.loadFilling : styles.loadDrainage,
            )}
          </View>
          <View style={styles.legendRow}>
            {this.renderLegend(
              'current_load',
              currentLoad,
              [styles.initialLoad].concat(this.isFilling() ? [styles.loadFilling] : []),
            )}
            {this.renderLegend('remaining_load', remainingLoad, styles.circuitLoad)}
          </View>
        </View>
      </View>
    );
  }
}

export default connect(state => ({
  interventionType: state.interventionPipe.intervention.type,
  installation: get('installation_repository').find(state.interventionPipe.intervention.installation),
  containerLoads: state.interventionPipe.intervention.containerLoads,
}))(InstallationGauge);
