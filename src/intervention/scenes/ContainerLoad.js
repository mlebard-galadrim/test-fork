import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Text, View } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import Icon from 'k2/app/modules/common/components/Icon';
import { get } from 'k2/app/container';
import ClientType from 'k2/app/modules/installation/models/ClientType';
import { BlockFloatInput, Button } from 'k2/app/modules/common/components/form';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import ErrorMessage from 'k2/app/modules/common/components/ErrorMessage';
import { fixed } from 'k2/app/modules/common/utils/filterUtils';
import { COLOR_PRIMARY, COLOR_ERROR, GUTTER, COLOR_LIGHT_BG } from 'k2/app/modules/common/styles/vars';
import { padding } from 'k2/app/modules/common/styles/utils';
import Option from 'k2/app/modules/common/components/Option';
import { setContainerLoad } from '../actions/interventionPipe';
import InterventionType from '../models/InterventionType';
import Purpose from '../models/Purpose';
import Gauge from '../components/Gauge';

/**
 * Container load scene allowing to fill/unfill the current container
 */
class ContainerLoad extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    setContainerLoad: PropTypes.func.isRequired,
    containerUuid: PropTypes.string.isRequired,
    interventionPurpose: PropTypes.oneOf(Purpose.values).isRequired,
    interventionType: PropTypes.oneOf([InterventionType.DRAINAGE, InterventionType.FILLING]).isRequired,
    currentClient: PropTypes.string.isRequired,
    installationId: PropTypes.string,
  };

  static defaultProps = {
    installationId: null,
  };

  static styles = {
    header: {
      backgroundColor: COLOR_PRIMARY,
      alignItems: 'center',
    },
    content: {
      ...padding(GUTTER),
    },
    row: {
      flexDirection: 'row',
    },
    loadValuesRow: {
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
      marginTop: 20,
      flex: 1,
    },
    disabledSubmit: {
      opacity: 0.3,
      backgroundColor: '#CCC',
    },
    error: {
      input: {
        borderColor: COLOR_ERROR,
      },
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
    title: {
      flex: 1,
      marginBottom: 10,
      textAlign: 'center',
    },
    switch: {
      flex: 0,
    },
  };

  constructor(props) {
    super(props);

    const { installationId } = props;

    this.analytics = get('firebase-analytics');
    this.containerRepository = get('container_repository');
    this.validator = get('validator');
    this.installation = installationId ? get('installation_repository').find(installationId) : null;
    this.state = {
      initialLoad: 0,
      finalLoad: 0,
      loadDiff: 0,
      isLoadDiffLocked: true,
      loadError: null,
      loadDiffError: null,
      loadDiffWarning: null,
      ...this.getState(props),
    };

    this.setLoad = this.setLoad.bind(this);
    this.setInitialLoad = this.setInitialLoad.bind(this);
    this.setFinalLoad = this.setFinalLoad.bind(this);
    this.setLoadDiff = this.setLoadDiff.bind(this);
    this.unlockLoadDiffInput = this.unlockLoadDiffInput.bind(this);
    this.lockLoadDiffInput = this.lockLoadDiffInput.bind(this);
    this.renderArticleMaxCapacity = this.renderArticleMaxCapacity.bind(this);
    this.getContainerMaxCapacity = this.getContainerMaxCapacity.bind(this);
  }

  /**
   * {@inhertidoc}
   */
  componentDidUpdate(prevProps) {
    const { containerUuid, interventionPurpose, interventionType, installationId } = this.props;
    const changed =
      prevProps.containerUuid !== containerUuid ||
      prevProps.interventionPurpose !== interventionPurpose ||
      prevProps.interventionType !== interventionType ||
      prevProps.installationId !== installationId;

    if (changed) {
      this.setState(this.getState(this.props));
    }
  }

  /**
   * {@inhertidoc}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.container !== null;
  }

  /**
   * {@inheritdoc}
   */
  componentWillUnmount() {
    this.props.setContainerLoad(0, null, null, null);
  }

  /**
   * Get state from props
   *
   * @param {Object} props
   *
   * @return {Object}
   */
  getState(props) {
    const { containerUuid } = props;

    const container = this.containerRepository.find(containerUuid);

    if (containerUuid && !container) {
      throw new Error(`No container found for uuid ${containerUuid}`);
    }

    return {
      isRecycled: this.hasRecycledWidget() ? false : null,
      forElimination: this.hasEliminationWidget() ? false : null,
      clientOwned: this.hasClientOwnedWidget() ? false : null,
      container,
    };
  }

  /**
   * Validate screen and set current container loaded mass
   */
  setLoad() {
    const { loadDiff, isRecycled, forElimination, clientOwned, isLoadDiffLocked } = this.state;

    const callbackSuccess = () => {
      this.analytics.logEvent(isLoadDiffLocked ? 'container_load_differential' : 'container_load_direct');
      this.props.setContainerLoad(loadDiff, isRecycled, forElimination, clientOwned);
      this.props.next(undefined, 'push');
    };

    if (this.isDrainageIntervention()) {
      return this.validator.validate(this.validator.isDrainageLoadPossible(loadDiff), callbackSuccess);
    }

    return this.validator.validate(this.validator.isFillingLoadPossible(loadDiff), callbackSuccess);
  }

  /**
   * Set the initial load and computes other values accordingly
   *
   * @param {String|Number} load
   */
  setInitialLoad(load) {
    const initialLoad = parseFloat(load.toString().replace(',', '.')) || 0;
    const { finalLoad } = this.state;

    this.setState(
      {
        initialLoad,
        loadDiff: Math.abs(finalLoad - initialLoad),
      },
      this.validInputs,
    );
  }

  /**
   * Set the final load and computes other values accordingly
   *
   * @param {String|Number} load
   */
  setFinalLoad(load) {
    const finalLoad = parseFloat(load.toString().replace(',', '.')) || 0;
    const { initialLoad } = this.state;

    this.setState(
      {
        finalLoad,
        loadDiff: Math.abs(finalLoad - initialLoad),
      },
      this.validInputs,
    );
  }

  /**
   * Set the load diff arbitrary
   *
   * @param {String|Number} load
   */
  setLoadDiff(load) {
    const loadDiff = parseFloat(load.replace(',', '.')) || 0;

    this.setState({ loadDiff }, this.validInputs);
  }

  /**
   * @return {Boolean} True if filling after transfer purpose
   */
  hasRecycledWidget() {
    return this.props.interventionPurpose === Purpose.FILLING_AFTER_TRANSFER;
  }

  /**
   * @return {Boolean} True if recuperation purpose
   */
  hasEliminationWidget() {
    return this.props.interventionPurpose === Purpose.RECUPERATION;
  }

  /**
   * @return {Boolean} True if filling type
   */
  hasClientOwnedWidget() {
    const { interventionType, currentClient } = this.props;
    const { client } = this.installation;
    const { FINAL, SERVICE_BENEFICIARY } = ClientType;

    return (
      interventionType === InterventionType.FILLING &&
      [FINAL, SERVICE_BENEFICIARY].includes(client.type) &&
      client.id !== currentClient
    );
  }

  /**
   * @return {Boolean} True if drainage intervention
   */
  isDrainageIntervention() {
    return InterventionType.DRAINAGE === this.props.interventionType;
  }

  /**
   * Validates inputs or shows an error
   */
  validInputs() {
    const { container, initialLoad, finalLoad, loadDiff, isLoadDiffLocked } = this.state;
    let loadError = null;
    let loadDiffError = null;
    let loadDiffWarning = null;
    const currentLoad = container.getCurrentLoad(this.isDrainageIntervention());

    if (!this.isDrainageIntervention() && loadDiff > currentLoad) {
      loadDiffWarning = I18n.t('scenes.intervention.container_load.warning:load:container_max_load', {
        load: fixed(currentLoad),
      });
    }

    if (!this.isDrainageIntervention() && this.validator.isFillingLoadPossible(loadDiff) !== true) {
      loadDiffWarning = I18n.t('scenes.intervention.container_load.warning:load:installation_max_load', {
        nominalLoad: fixed(this.installation.primaryCircuit.nominalLoad),
      });
    }

    if (isLoadDiffLocked) {
      if (this.isDrainageIntervention() && initialLoad > finalLoad) {
        loadError = I18n.t('scenes.intervention.container_load.error:load:initial_gt_final');
      }

      if (!this.isDrainageIntervention() && initialLoad < finalLoad) {
        loadError = I18n.t('scenes.intervention.container_load.error:load:initial_lt_final');
      }
    }

    if (loadDiff === 0) {
      loadDiffError = I18n.t(
        this.isDrainageIntervention()
          ? 'scenes.intervention.container_load.error:load:diff_drainage_lt_zero'
          : 'scenes.intervention.container_load.error:load:diff_filling_lt_zero',
      );
    }

    if (this.isDrainageIntervention()) {
      const maxCapacity = this.getContainerMaxCapacity(container);

      if (maxCapacity && currentLoad + loadDiff > maxCapacity) {
        loadDiffWarning = I18n.t('scenes.intervention.container_load.error:load:diff_drainage_max_capacity', {
          maxCapacity: fixed(maxCapacity),
        });
      }
    }

    this.setState({ loadError, loadDiffError, loadDiffWarning });
  }

  /**
   * Unlock the load diff input to set the value arbitrary
   */
  unlockLoadDiffInput() {
    this.setState({
      initialLoad: 0,
      finalLoad: 0,
      loadDiff: 0,
      loadError: null,
      loadDiffError: null,
      loadDiffWarning: null,
      isLoadDiffLocked: false,
    });
  }

  /**
   * Lock back the diff input in order to compute it from initial and final loads.
   */
  lockLoadDiffInput() {
    this.setState({
      initialLoad: 0,
      finalLoad: 0,
      loadDiff: 0,
      loadError: null,
      loadDiffError: null,
      loadDiffWarning: null,
      isLoadDiffLocked: true,
    });
  }

  /**
   * @return {Boolean} True if the screen can be submitted
   */
  isFormValid() {
    const { loadError, loadDiffError, loadDiff } = this.state;

    return loadError === null && loadDiffError === null && loadDiff > 0;
  }

  /**
   * @return {Element|null}
   */
  renderRecycledWidget() {
    const { styles } = this.constructor;

    if (this.state.isRecycled === null) {
      return null;
    }

    return (
      <Option label={I18n.t('scenes.intervention.container_load.recycled')} ellipsizeMode="tail" numberOfLines={2}>
        <Switch
          style={styles.switch}
          testID="recycled-switch"
          trackColor="#AAA"
          value={this.state.isRecycled}
          onValueChange={isRecycled => this.setState({ isRecycled })}
        />
      </Option>
    );
  }

  /**
   * @return {Element|null}
   */
  renderEliminationWidget() {
    const { styles } = this.constructor;

    if (this.state.forElimination === null) {
      return null;
    }

    return (
      <Option label={I18n.t('scenes.intervention.container_load.elimination')} ellipsizeMode="tail" numberOfLines={2}>
        <Switch
          style={styles.switch}
          testID="elimination-switch"
          trackColor="#AAA"
          value={this.state.forElimination}
          onValueChange={forElimination => this.setState({ forElimination })}
        />
      </Option>
    );
  }

  /**
   * @return {Element|null}
   */
  renderClientOwnedWidget() {
    const { styles } = this.constructor;

    if (this.state.clientOwned === null) {
      return null;
    }

    return (
      <Option label={I18n.t('scenes.intervention.container_load.client_owned')} ellipsizeMode="tail" numberOfLines={2}>
        <Switch
          style={styles.switch}
          testID="client-owned-switch"
          trackColor="#AAA"
          value={this.state.clientOwned}
          onValueChange={clientOwned => this.setState({ clientOwned })}
        />
      </Option>
    );
  }

  /**
   * @return {Element|null}
   */
  renderArticleMaxCapacity() {
    const maxCapacity = this.getContainerMaxCapacity(this.state.container);
    const { styles } = this.constructor;

    if (!maxCapacity) {
      return null;
    }

    return (
      <View style={styles.maxCapacityWrapper}>
        <Icon name="info-circle" />
        <Text style={styles.maxCapacityText}>
          {I18n.t('scenes.intervention.container_load.article_max_capacity', {
            maxCapacity: fixed(maxCapacity),
          })}
        </Text>
      </View>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { container, isLoadDiffLocked, loadError, loadDiffError, loadDiff, initialLoad, finalLoad, loadDiffWarning } =
      this.state;

    return (
      <WrapperView full scrollable keyboardAware>
        <Gauge
          style={styles.header}
          value={
            container.getCurrentLoad(this.isDrainageIntervention()) +
            loadDiff * (this.isDrainageIntervention() ? 1 : -1)
          }
          min={0}
          max={this.getContainerMaxCapacity(container)}
        />
        {this.isDrainageIntervention() && this.renderArticleMaxCapacity()}
        <View style={styles.content}>
          <View style={styles.loadValuesRow}>
            <View style={styles.loadValuesInputColumn}>
              <Text style={styles.loadValuesInputLabel}>
                {I18n.t('scenes.intervention.container_load.initial_balance')}
              </Text>
              <View style={styles.row}>
                <BlockFloatInput
                  style={{
                    ...styles.loadValuesInput,
                    ...(!isLoadDiffLocked ? styles.disabledInput : {}),
                    ...(loadError ? styles.error.input : {}),
                  }}
                  testID="initial-load"
                  editable={isLoadDiffLocked}
                  defaultValue={initialLoad.toString()}
                  onChangeText={this.setInitialLoad}
                />
              </View>
            </View>
            <Text style={styles.loadValuesOperator}>-</Text>
            <View style={styles.loadValuesInputColumn}>
              <Text style={styles.loadValuesInputLabel}>
                {I18n.t('scenes.intervention.container_load.final_balance')}
              </Text>
              <View style={styles.row}>
                <BlockFloatInput
                  style={{
                    ...styles.loadValuesInput,
                    ...(!isLoadDiffLocked ? styles.disabledInput : {}),
                    ...(loadError ? styles.error.input : {}),
                  }}
                  testID="final-load"
                  editable={isLoadDiffLocked}
                  defaultValue={finalLoad.toString()}
                  onChangeText={this.setFinalLoad}
                />
              </View>
            </View>
          </View>
          {ErrorMessage.create(loadError)}
          <Text style={styles.title}>
            {I18n.t(
              this.isDrainageIntervention()
                ? 'scenes.intervention.container_load.drainage_load_diff'
                : 'scenes.intervention.container_load.filling_load_diff',
            )}
          </Text>
          <View style={styles.loadDiffRow}>
            <Text style={styles.loadDiffOperator}>=</Text>
            <View style={styles.loadDiffInputGroup}>
              <BlockFloatInput
                style={{
                  ...styles.loadDiffInput,
                  ...(isLoadDiffLocked ? styles.disabledInput : {}),
                  ...(loadDiffError ? styles.error.input : {}),
                }}
                testID="diff-load"
                editable={!isLoadDiffLocked}
                defaultValue={loadDiff}
                onChangeText={this.setLoadDiff}
              />
              <Button
                testID="lock-button"
                onPress={isLoadDiffLocked ? this.unlockLoadDiffInput : this.lockLoadDiffInput}
                style={{
                  ...styles.loadDiffInputLockWidget,
                  ...(loadDiffError ? styles.error.input : {}),
                }}
              >
                <IconFA name={isLoadDiffLocked ? 'lock' : 'unlock'} size={20} color="#666" />
              </Button>
            </View>
          </View>
          {ErrorMessage.create(loadDiffError)}
          {ErrorMessage.create(loadDiffWarning, true)}
          {this.renderRecycledWidget()}
          {this.renderEliminationWidget()}
          {this.renderClientOwnedWidget()}
          <View style={styles.row}>
            <Button testID="validate" onPress={this.setLoad} valid={this.isFormValid()} style={styles.submit}>
              {I18n.t('common.submit')}
            </Button>
          </View>
        </View>
      </WrapperView>
    );
  }

  getContainerMaxCapacity(container) {
    return container.article.fluid
      ? // get or compute the capacity for the container according to the registered article & fluid
      container.getCapacityWithExcess()
      : // recup/transfer containers don't have a registered fluid, use the installation primary fluid as ref:
      container.getCapacityWithExcess(this.installation.primaryCircuit.fluid);
  }
}

export default connect(
  (state, props) => ({
    installationId: state.interventionPipe.intervention.installation,
    containerUuid:
      state.interventionPipe.intervention && state.interventionPipe.intervention.getLastContainerLoad()
        ? state.interventionPipe.intervention.getLastContainerLoad().containerUuid
        : null,
    interventionPurpose: state.interventionPipe.intervention.purpose,
    interventionType: state.interventionPipe.intervention.type,
    currentClient: state.authentication.userProfile.clientUuid,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    setContainerLoad: (...args) => dispatch(setContainerLoad(...args)),
  }),
)(ContainerLoad);
