import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BOTTOM_SPACE, COLOR_LIGHT_BG, COLOR_PRIMARY, GUTTER, HEIGHT_HEADER } from 'k2/app/modules/common/styles/vars';
import { padding } from 'k2/app/modules/common/styles/utils';
import { connect } from 'react-redux';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import { transferLoad } from 'k2/app/modules/transfer/actions/transferActions';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import Container from 'k2/app/modules/container/models/Container';
import { navigate } from 'k2/app/navigation';
import { PIPE_TRANSFER_SUMUP } from 'k2/app/modules/transfer/constants';
import ErrorMessage from 'k2/app/modules/common/components/ErrorMessage';
import { Dimensions, Text, View } from 'react-native';
import { BlockFloatInput, Button } from 'k2/app/modules/common/components/form';
import Gauge from 'k2/app/modules/intervention/components/Gauge';
import { ifIphoneX } from 'k2/app/modules/common/styles/safe-areas-helper';
import { fixed } from 'k2/app/modules/common/utils/filterUtils';

const { height } = Dimensions.get('window');

class TransferLoad extends Component {
  static propTypes = {
    source: PropTypes.instanceOf(Container).isRequired,
    target: PropTypes.instanceOf(Container).isRequired,
    transferLoad: PropTypes.func.isRequired,
  };

  static styles = {
    header: {
      flex: 0,
      backgroundColor: COLOR_PRIMARY,
      alignItems: 'center',
    },
    footer: {
      flex: 0,
      backgroundColor: COLOR_PRIMARY,
      alignItems: 'center',
    },
    gauge: {
      flex: 0,
      backgroundColor: COLOR_PRIMARY,
      alignItems: 'center',
    },
    content: {
      ...padding(GUTTER),
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      // TODO: find a better way...
      minHeight:
        height - ifIphoneX(25, 0) - HEIGHT_HEADER - BOTTOM_SPACE - (Gauge.GAUGE_SIZE / 2 + Gauge.TITLE_HEIGHT) * 2 - 65,
      backgroundColor: 'white',
    },
    row: {
      flexDirection: 'row',
    },
    loadValuesRow: {
      flex: 0,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: GUTTER,
    },
    loadValuesInputColumn: {
      flex: 1,
      alignItems: 'center',
    },
    loadValuesInput: {
      borderRadius: 5,
      borderColor: '#CCC',
      borderWidth: 1,
      flex: 1,
      fontSize: 20,
      height: 55,
      ...padding(4, 10),
    },
    disabledInput: {
      height: 55,
      backgroundColor: '#EEE',
      borderColor: '#cccccc',
    },
    loadValuesInputLabel: {
      fontSize: 12,
      textAlign: 'center',
      marginBottom: 10,
    },
    loadValuesOperator: {
      flex: 0,
      fontSize: 28,
      fontWeight: 'bold',
      paddingLeft: 10,
      paddingRight: 10,
      top: 12,
    },
    loadDiffRow: {
      flex: 0,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      justifyContent: 'center',
    },
    loadDiffOperator: {
      flex: 0,
      fontSize: 28,
      paddingLeft: GUTTER,
      paddingRight: GUTTER,
      fontWeight: 'bold',
    },
    loadDiffInputGroup: {
      flex: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadDiffInput: {
      flex: 0,
      height: 55,
      ...padding(4, 5, 4, 10),
      borderColor: '#6fc2ff',
      borderWidth: 1,
      borderRadius: 5,
      fontSize: 24,
      flexBasis: 150,
    },
    loadDiffInputLockWidget: {
      flex: 0,
      height: 55,
      left: -5,
      zIndex: 10,
      backgroundColor: '#eeeeee',
      borderColor: '#cccccc',
      borderWidth: 1,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      ...padding(0, 15),
      margin: 0,
    },
    submit: {
      shadowColor: '#000',
      shadowTopOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      flex: 1,
    },
    disabledSubmit: {
      opacity: 0.3,
      backgroundColor: '#CCC',
    },
    maxCapacityWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      backgroundColor: COLOR_LIGHT_BG,
    },
    maxCapacityText: {
      flex: 1,
      marginLeft: 10,
      fontSize: 14,
      fontWeight: '500',
    },
    loadLabel: {
      flex: 0,
      marginBottom: 10,
      textAlign: 'center',
    },
  };

  constructor(props) {
    super(props);

    this.unlockLoadDiffInput = this.unlockLoadDiffInput.bind(this);
    this.lockLoadDiffInput = this.lockLoadDiffInput.bind(this);
    this.setTransferredLoad = this.setTransferredLoad.bind(this);
    this.setInitialLoad = this.setInitialLoad.bind(this);
    this.setFinalLoad = this.setFinalLoad.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.validInputs = this.validInputs.bind(this);
    this.getInitialInputsValues = this.getInitialInputsValues.bind(this);

    this.state = {
      ...this.getInitialInputsValues(),
      isLoadDiffLocked: true,
      warning: null,
    };
  }

  onSubmit() {
    this.props.transferLoad(this.state.loadDiff);

    navigate(PIPE_TRANSFER_SUMUP);
  }

  getInitialInputsValues() {
    const sourceLoad = this.props.source.getCurrentLoad();

    return {
      // Init form with source current load
      initialLoad: sourceLoad || 0.0,
      finalLoad: sourceLoad || 0.0,
      loadDiff: 0,
    };
  }

  /**
   * @return {Boolean} True if the screen can be submitted
   */
  isFormValid() {
    const { loadDiff } = this.state;

    return loadDiff > 0;
  }

  /**
   * Validates inputs and show warnings
   */
  validInputs() {
    const { source, target } = this.props;
    const { loadDiff } = this.state;
    let warning = null;
    const currentSourceLoad = source.getCurrentLoad();
    const currentTargetLoad = target.getCurrentLoad(true);

    if (currentSourceLoad !== null && loadDiff > currentSourceLoad) {
      // Transferred load exceeds source container load
      warning = I18n.t('scenes.transfer.transfer_load.warning:load.source_load_exceeded', {
        load: fixed(currentSourceLoad),
      });
    }

    const maxTargetCapacity = target.getCapacityWithExcess(source.fluid);
    if (maxTargetCapacity !== 0 && (currentTargetLoad || 0) + loadDiff > maxTargetCapacity) {
      // Transferred load exceeds source container load
      warning = I18n.t('scenes.transfer.transfer_load.warning:load.target_max_load_exceeded', {
        maxCapacity: fixed(maxTargetCapacity),
      });
    }

    this.setState({ warning });
  }

  /**
   * Unlock the load diff input to set the value arbitrary
   */
  unlockLoadDiffInput() {
    this.setState({
      ...this.getInitialInputsValues(),
      warning: null,
      isLoadDiffLocked: false,
    });
  }

  /**
   * Lock back the diff input in order to compute it from initial and final loads.
   */
  lockLoadDiffInput() {
    this.setState({
      ...this.getInitialInputsValues(),
      warning: null,
      isLoadDiffLocked: true,
    });
  }

  /**
   * Set the transferred load and computes other values accordingly
   *
   * @param {String|Number} load
   */
  setTransferredLoad(load) {
    const loadDiff = Math.abs(parseFloat(load.toString().replace(',', '.')) || 0);
    const { initialLoad } = this.state;

    this.setState(
      {
        initialLoad,
        finalLoad: initialLoad - loadDiff,
        loadDiff,
      },
      this.validInputs,
    );
  }

  /**
   * @param {String|Number} load
   */
  setFinalLoad(load) {
    const finalLoad = Math.abs(parseFloat(load.toString().replace(',', '.')) || 0);
    const { initialLoad } = this.state;

    this.setState(
      {
        initialLoad,
        finalLoad,
        loadDiff: Math.max(0, initialLoad - finalLoad),
      },
      this.validInputs,
    );
  }

  /**
   * @param {String|Number} load
   */
  setInitialLoad(load) {
    const initialLoad = Math.abs(parseFloat(load.toString().replace(',', '.')) || 0);
    const { finalLoad } = this.state;

    this.setState(
      {
        initialLoad,
        finalLoad,
        loadDiff: Math.max(0, initialLoad - finalLoad),
      },
      this.validInputs,
    );
  }

  render() {
    const { styles } = this.constructor;
    const { source, target } = this.props;
    const { isLoadDiffLocked, loadDiff, initialLoad, finalLoad, warning } = this.state;

    return (
      <WrapperView full scrollable keyboardAware>
        <View style={styles.header}>
          <Gauge
            style={styles.gauge}
            title={I18n.t('scenes.transfer.transfer_load.gauge_source')}
            value={source.getCurrentLoad() - loadDiff}
            min={0}
            max={source.getCapacityWithExcess()}
          />
        </View>
        <View style={styles.content}>
          <View style={styles.loadValuesRow}>
            <View style={styles.loadValuesInputColumn}>
              <Text style={styles.loadValuesInputLabel}>{I18n.t('scenes.transfer.transfer_load.initial_balance')}</Text>
              <View style={styles.row}>
                <BlockFloatInput
                  style={{
                    ...styles.loadValuesInput,
                    ...(!isLoadDiffLocked ? styles.disabledInput : {}),
                  }}
                  editable={isLoadDiffLocked}
                  defaultValue={initialLoad.toString()}
                  onChangeText={this.setInitialLoad}
                />
              </View>
            </View>
            <Text style={styles.loadValuesOperator}>-</Text>
            <View style={styles.loadValuesInputColumn}>
              <Text style={styles.loadValuesInputLabel}>{I18n.t('scenes.transfer.transfer_load.final_balance')}</Text>
              <View style={styles.row}>
                <BlockFloatInput
                  style={{
                    ...styles.loadValuesInput,
                    ...(!isLoadDiffLocked ? styles.disabledInput : {}),
                  }}
                  editable={isLoadDiffLocked}
                  defaultValue={finalLoad.toString()}
                  onChangeText={this.setFinalLoad}
                />
              </View>
            </View>
          </View>
          <View>
            <Text style={styles.loadLabel}>{I18n.t('scenes.transfer.transfer_load.transferred_load')}</Text>
            <View style={styles.loadDiffRow}>
              <Text style={styles.loadDiffOperator}>=</Text>
              <View style={styles.loadDiffInputGroup}>
                <BlockFloatInput
                  style={{
                    ...styles.loadDiffInput,
                    ...(isLoadDiffLocked ? styles.disabledInput : {}),
                  }}
                  editable={!isLoadDiffLocked}
                  defaultValue={loadDiff.toString()}
                  onChangeText={this.setTransferredLoad}
                />
                <Button
                  onPress={isLoadDiffLocked ? this.unlockLoadDiffInput : this.lockLoadDiffInput}
                  style={{
                    ...styles.loadDiffInputLockWidget,
                  }}
                >
                  <IconFA name={isLoadDiffLocked ? 'lock' : 'unlock'} size={20} color="#666" />
                </Button>
              </View>
            </View>
            {ErrorMessage.create(warning, true)}
          </View>
        </View>
        <View style={styles.footer}>
          <Gauge
            style={styles.gauge}
            title={I18n.t('scenes.transfer.transfer_load.gauge_target')}
            value={target.getCurrentLoad(true) + loadDiff}
            min={0}
            max={target.getCapacityWithExcess(source.fluid)}
          />
        </View>
        <View>
          <Button onPress={this.onSubmit} valid={this.isFormValid()} style={styles.submit}>
            {I18n.t('common.submit')}
          </Button>
        </View>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    source: state.transferReducer.source,
    target: state.transferReducer.target,
  }),
  dispatch => ({
    transferLoad: container => dispatch(transferLoad(container)),
  }),
)(TransferLoad);
