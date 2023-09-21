import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Dimensions, FlatList, Image, View } from 'react-native';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import { navigate, SCENE_SYNC_DETAILS } from 'k2/app/navigation';
import Text from 'k2/app/modules/common/components/Text';
import chunk from '../utils/chunk';
import { Button } from '../components/form';
import WrapperView from '../components/WrapperView';
import {
  BOTTOM_SPACE,
  HEIGHT_HEADER,
  COLOR_PRIMARY,
  GUTTER,
  COLOR_LIGHT_BG,
  COLOR_INFO,
  COLOR_WARNING,
} from '../styles/vars';
import InterventionType from 'k2/app/modules/intervention/models/InterventionType';
import ClientFilter from 'k2/app/modules/installation/filters/ClientFilter';
import ShippingType from 'k2/app/modules/shipping/models/ShippingType';
import { createIntervention, resetIntervention } from 'k2/app/modules/intervention/actions/interventionPipe';
import { createShipping } from 'k2/app/modules/shipping/actions/shippingPipe';
import {
  iconBottleOut,
  iconBottleIn,
  iconLeakSearch,
  iconLeakRepair,
  iconTruckIn,
  iconTruckOut,
  iconPlan,
  iconBottleSearch,
  iconSheet,
  iconTransfer,
  iconAnalysis,
  iconCoolantDrainage,
} from 'k2/app/assets/icons';
import { PIPE_SCAN_CONTAINER, PIPE_CONTAINER_INFOS } from 'k2/app/modules/container/constants';
import { PIPE_INSTALLATION_MANAGEMENT } from '../../installation/constants';
import { PIPE_MY_INTERVENTIONS } from 'k2/app/modules/intervention/constants';
import { ifIphoneX } from '../styles/safe-areas-helper';
import Icon from '../components/Icon';
import { padding } from '../styles/utils';
import { logout, synchronize } from '../../authentication/actions/authenticationActions';
import { PIPE_TRANSFER, PIPE_TRANSFER_SELECT_SOURCE } from 'k2/app/modules/transfer/constants';
import AppVersionGuard from 'k2/app/modules/version/components/AppVersionGuard';
import { OIL_ANALYSIS } from '../../analysis/constants';
import { createAnalysis, resetAnalysis } from '../../analysis/actions/oilAnalysisActions';

const { height } = Dimensions.get('window');

class Dashboard extends Component {
  static CHECK_SYNC_OUTDATED_EACH = 1000 * 60 * 30; // 30min

  static propTypes = {
    createIntervention: PropTypes.func.isRequired,
    resetIntervention: PropTypes.func.isRequired,
    createAnalysis: PropTypes.func.isRequired,
    resetAnalysis: PropTypes.func.isRequired,
    synchronize: PropTypes.func.isRequired,
    createShipping: PropTypes.func.isRequired,
    localModificationsCount: PropTypes.number.isRequired,
    chain: PropTypes.shape(),
    selectedLang: PropTypes.string.isRequired,
    lastSynchronization: PropTypes.number,
    logout: PropTypes.func.isRequired,
    plannedInterventionsRemaining: PropTypes.bool.isRequired,
    freeUser: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    chain: null,
    lastSynchronization: null,
  };

  static styles = {
    banner: {
      container: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
      },
      info: {
        backgroundColor: COLOR_INFO,
      },
      warning: {
        backgroundColor: COLOR_WARNING,
      },
      message: {
        flex: 1,
        backgroundColor: 'transparent',
        ...padding(10, 10, 10, 40),
      },
      text: {
        fontSize: 14,
        color: COLOR_LIGHT_BG,
        textAlign: 'center',
      },
      close: {
        flex: 0,
        backgroundColor: 'transparent',
        ...padding(15),
      },
      closeIcon: {
        flex: 0,
        color: COLOR_LIGHT_BG,
        fontSize: 14,
      },
    },
    row: {
      flexDirection: 'row',
      // -25 for iphone X is an adhoc fix as there is still an unexpected padding missing...
      height: (height - ifIphoneX(25, 0) - HEIGHT_HEADER - BOTTOM_SPACE - GUTTER * 2) / 6,
    },
    button: {
      flex: 1,
      padding: GUTTER / 2,
      margin: GUTTER / 2,
      borderWidth: 2,
      borderColor: '#CCEBF8',
      borderRadius: 5,
      backgroundColor: 'transparent',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    buttonBand: {
      backgroundColor: COLOR_WARNING,
      position: 'absolute',
      top: -2,
      bottom: -2,
      width: GUTTER,
      left: -2,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
    },
    text: {
      flex: 0,
      fontSize: 13,
      lineHeight: 16,
      color: COLOR_PRIMARY,
      margin: 0,
      padding: 0,
      paddingLeft: GUTTER / 2,
      textAlign: 'center',
    },
    icon: {
      flex: 0,
      width: 60,
      height: 45,
      margin: 0,
      padding: 0,
    },
    placeholder: {
      minHeight: 100,
      padding: GUTTER,
      margin: GUTTER / 2,
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    unique: {
      button: {
        flexDirection: 'row',
      },
      text: {
        flex: 1,
        textAlign: 'left',
      },
      icon: {
        width: 48,
        height: 36,
        marginRight: GUTTER,
      },
    },
  };

  constructor(props) {
    super(props);

    this.validator = get('validator');
    this.analytics = get('firebase-analytics');
    this.orchestrators = {
      intervention: get('intervention_orchestrator'),
      installation: get('installation_orchestrator'),
      shipping: get('shipping_orchestrator'),
      analysis: get('analysis_orchestrator'),
    };

    this.colums = 2;
    const items = [
      {
        target: InterventionType.FILLING,
        title: InterventionType.readableFor(InterventionType.FILLING),
        icon: iconBottleOut,
        initialProps: {
          exit: 'common.exit.intervention.title',
          filter: ClientFilter.WITH_INSTALLATION,
          suggestPreviousInstallation: true,
        },
        availableAsFreeUser: false,
      },
      {
        target: InterventionType.DRAINAGE,
        title: InterventionType.readableFor(InterventionType.DRAINAGE),
        icon: iconBottleIn,
        initialProps: {
          exit: 'common.exit.intervention.title',
          filter: ClientFilter.WITH_INSTALLATION,
          suggestPreviousInstallation: true,
        },
        availableAsFreeUser: false,
      },
      {
        target: InterventionType.LEAK,
        title: InterventionType.readableFor(InterventionType.LEAK),
        icon: iconLeakSearch,
        initialProps: {
          exit: 'common.exit.intervention.title',
          filter: ClientFilter.WITH_INSTALLATION,
          suggestPreviousInstallation: true,
        },
        availableAsFreeUser: false,
      },
      {
        target: InterventionType.LEAK_REPAIR,
        title: InterventionType.readableFor(InterventionType.LEAK_REPAIR),
        icon: iconLeakRepair,
        initialProps: {
          exit: 'common.exit.intervention.title',
          filter: ClientFilter.LEAKING,
          suggestPreviousInstallation: true,
        },
        availableAsFreeUser: false,
      },
      {
        target: ShippingType.IN,
        title: ShippingType.readableFor(ShippingType.IN),
        icon: iconTruckOut,
        initialProps: {
          exit: 'common.exit.shipping.title',
          filter: ClientFilter.WITH_INSTALLATION,
        },
        availableAsFreeUser: false,
      },
      {
        target: ShippingType.OUT,
        title: ShippingType.readableFor(ShippingType.OUT),
        icon: iconTruckIn,
        initialProps: {
          exit: 'common.exit.shipping.title',
          filter: ClientFilter.WITH_SITE,
        },
        availableAsFreeUser: false,
      },
      {
        target: InterventionType.COOLANT_DRAINAGE,
        title: InterventionType.readableFor(InterventionType.COOLANT_DRAINAGE),
        icon: iconCoolantDrainage,
        initialProps: {
          exit: 'common.exit.intervention.title',
          filter: ClientFilter.WITH_INSTALLATION,
          suggestPreviousInstallation: true,
        },
      },
      {
        target: OIL_ANALYSIS,
        title: 'scenes.analysis.title',
        icon: iconAnalysis,
        initialProps: {
          exit: true,
          filter: ClientFilter.WITH_INSTALLATION,
        },
      },
      {
        target: PIPE_TRANSFER,
        title: 'scenes.transfer.title',
        icon: iconTransfer,
        initialProps: {
          exit: 'common.exit.transfer.title',
        },
        availableAsFreeUser: false,
      },
      {
        target: PIPE_CONTAINER_INFOS,
        title: 'scenes.container_infos.title',
        icon: iconBottleSearch,
        initialProps: {
          exit: true,
        },
        availableAsFreeUser: true,
      },
      {
        target: PIPE_INSTALLATION_MANAGEMENT,
        title: 'scenes.installation.management.title',
        icon: iconPlan,
        initialProps: {
          exit: true,
          filter: ClientFilter.FOR_MANAGEMENT,
        },
        availableAsFreeUser: true,
      },
      {
        target: PIPE_MY_INTERVENTIONS,
        title: 'scenes.my_interventions.title',
        icon: iconSheet,
        initialProps: {
          exit: true,
        },
        withBanner: this.props.plannedInterventionsRemaining,
        availableAsFreeUser: true,
      },
    ];

    this.state = {
      closeBanner: false,
      syncOutdated: false,
      hasRefreshToken: true,
      items: items,
    };

    this.renderItem = this.renderItem.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderBanner = this.renderBanner.bind(this);
    this.onCloseBanner = this.onCloseBanner.bind(this);
    this.onSynchronize = this.onSynchronize.bind(this);
    this.checkSyncOutdated = this.checkSyncOutdated.bind(this);
    this.checkHasRefreshToken = this.checkHasRefreshToken.bind(this);
    this.registerCheckSyncOutdated = this.registerCheckSyncOutdated.bind(this);
    this.unregisterCheckSyncOutdated = this.unregisterCheckSyncOutdated.bind(this);
  }

  onCloseBanner() {
    this.setState({ closeBanner: true });
  }

  async onSynchronize() {
    // Does only navigate if sync has started
    const shouldNavigate = await this.props.synchronize();

    if (shouldNavigate) {
      navigate(SCENE_SYNC_DETAILS);
    }
  }

  componentDidMount() {
    this.checkHasRefreshToken();
    this.checkSyncOutdated();
  }

  componentWillUnmount() {
    this.unregisterCheckSyncOutdated();
  }

  componentDidUpdate(prevProps, prevState) {
    const { chain, localModificationsCount, lastSynchronization, plannedInterventionsRemaining } = this.props;

    if (prevProps.plannedInterventionsRemaining !== plannedInterventionsRemaining) {
      const newItems = [...prevState.items];
      const myInterventionsItem = newItems.find(item => item.target === PIPE_MY_INTERVENTIONS);
      if (myInterventionsItem) {
        myInterventionsItem.withBanner = plannedInterventionsRemaining;
      }

      this.setState({ items: newItems });
    }

    if (chain !== prevProps.chain) {
      const { type, intervention } = chain;

      this.navigate(type.value, this.getOperationInitialsProps(type.value), intervention.installation);

      return;
    }

    const lastSyncDateChanged = prevProps.lastSynchronization !== lastSynchronization;

    // If a sync was done, it's not outdated anymore:
    if (lastSyncDateChanged) {
      this.setState({ syncOutdated: false });
    }

    this.registerCheckSyncOutdated();

    // If the data count changed or last sync date changed, allow to display back the banner:
    if (prevProps.localModificationsCount !== localModificationsCount || lastSyncDateChanged) {
      this.setState({ closeBanner: false });
    }
  }

  checkSyncOutdated() {
    this.setState({
      syncOutdated: !get('synchronizer').isFresh(this.props.lastSynchronization),
    });
  }

  checkHasRefreshToken() {
    get('authenticator')
      .getRefreshToken()
      .then(token => {
        this.setState({ hasRefreshToken: token !== null });
      });
  }

  registerCheckSyncOutdated() {
    if (typeof this.checkSyncOutdatedInterval === 'number') {
      return;
    }

    this.checkSyncOutdatedInterval = setInterval(this.checkSyncOutdated, Dashboard.CHECK_SYNC_OUTDATED_EACH);
  }

  unregisterCheckSyncOutdated() {
    if (this.checkSyncOutdatedInterval) {
      clearInterval(this.checkSyncOutdatedInterval);
      this.checkSyncOutdatedInterval = null;
    }
  }

  getOperationInitialsProps(suggestedOperation) {
    const operation = this.state.items.find(item => item.target === suggestedOperation);

    return operation ? { ...operation.initialProps, title: I18n.t(operation.title) } : {};
  }

  /**
   * Navigate to the screen selected by the user
   *
   * @param {String} target
   * @param {Object} initialProps
   */
  navigate(target, initialProps = {}, installation = null) {
    const { orchestrators, validator } = this;
    /** @type Orchestrator|null */
    let orchestrator = null;
    let isIntervention = null;

    this.analytics.logEvent('dashboard_button', { target });

    this.props.resetIntervention();
    this.props.resetAnalysis();

    switch (target) {
      case InterventionType.DRAINAGE:
      case InterventionType.FILLING:
      case InterventionType.LEAK:
      case InterventionType.LEAK_REPAIR:
      case InterventionType.COOLANT_DRAINAGE:
        isIntervention = true;
        this.props.createIntervention(target, installation);
        orchestrator = orchestrators.intervention;
        break;

      case PIPE_INSTALLATION_MANAGEMENT:
        orchestrator = orchestrators.installation;
        break;

      case ShippingType.IN:
      case ShippingType.OUT:
        this.props.createShipping(new ShippingType(target));
        orchestrator = orchestrators.shipping;
        break;

      case PIPE_CONTAINER_INFOS:
        navigate(PIPE_SCAN_CONTAINER, { missingCode: true, ...initialProps });
        return;

      case PIPE_TRANSFER:
        navigate(PIPE_TRANSFER_SELECT_SOURCE, { ...initialProps });
        return;

      case PIPE_MY_INTERVENTIONS:
        navigate(PIPE_MY_INTERVENTIONS, { ...initialProps });
        return;

      case OIL_ANALYSIS:
        // this.props.createAnalysis(AnalysisNature.OIL);
        orchestrator = orchestrators.analysis;
        break;

      default:
        throw new Error(`Unknown target "${target}".`);
    }

    function next(props = {}, type = undefined) {
      const step = orchestrator.getStep();

      navigate(step.name, { next, ...props, ...step.props }, type);
    }

    validator.validate([validator.isCOPCValid(isIntervention)], () => next(initialProps));
  }

  /**
   * Render one item of the grid
   *
   * @param {Object} item
   * @param {Number} index
   *
   * @return {Button}
   */
  renderItem(item, index, unique = false) {
    const { styles } = this.constructor;
    const { target, icon, title, initialProps, availableAsFreeUser } = item;
    const { freeUser } = this.props;

    if (!target) {
      return (
        <Button
          key={`item-${index}`}
          style={{
            ...styles.button,
            ...styles.placeholder,
          }}
          onPress={() => {}}
        />
      );
    }

    return (
      <Button
        key={`item-${index}`}
        onPress={() => {
          if (freeUser && !availableAsFreeUser) {
            Alert.alert(
              I18n.t('scenes.dashboard.free_user_popup.title'),
              I18n.t('scenes.dashboard.free_user_popup.content'),
              [{ text: I18n.t('scenes.dashboard.free_user_popup.back'), type: 'cancel' }],
              { cancelable: true },
            );
          } else {
            this.navigate(target, { ...initialProps, title: I18n.t(title) });
          }
        }}
        style={{ ...styles.button, ...(unique ? styles.unique.button : {}) }}>
        {item.withBanner ? <View style={styles.buttonBand} /> : null}
        <Image resizeMode="contain" style={{ ...styles.icon, ...(unique ? styles.unique.icon : {}) }} source={icon} />
        <Text styleName="bold" style={{ ...styles.text, ...(unique ? styles.unique.text : {}) }}>
          {I18n.t(title)}
        </Text>
      </Button>
    );
  }

  /**
   * Render a row of the grid
   *
   * @param {Array} items
   *
   * @return {GridRow}
   */
  renderRow(items) {
    const { styles } = this.constructor;

    const row = items.item;

    return <View style={styles.row}>{row.map((item, index) => this.renderItem(item, index, row.length === 1))}</View>;
  }

  renderBanner() {
    const { styles } = this.constructor;
    const { closeBanner, syncOutdated, hasRefreshToken } = this.state;
    const { localModificationsCount } = this.props;

    if (closeBanner) {
      return;
    }

    if (syncOutdated) {
      return (
        <View style={{ ...styles.banner.container, ...styles.banner.warning }}>
          <Button style={styles.banner.message} onPress={this.onSynchronize}>
            <Text style={styles.banner.text}>
              <Icon name="exclamation-triangle" /> {I18n.t('scenes.dashboard.banner.outdated_sync')}
            </Text>
          </Button>
          <Button style={styles.banner.close} onPress={this.onCloseBanner}>
            <Icon style={styles.banner.closeIcon} name="times" />
          </Button>
        </View>
      );
    }

    if (!hasRefreshToken) {
      return (
        <View style={{ ...styles.banner.container, ...styles.banner.warning }}>
          <Button style={styles.banner.message} onPress={this.props.logout}>
            <Text style={styles.banner.text}>
              <Icon name="exclamation-triangle" /> {I18n.t('scenes.dashboard.banner.no_refresh_token')}
            </Text>
          </Button>
        </View>
      );
    }

    if (localModificationsCount > 0) {
      return (
        <View style={{ ...styles.banner.container, ...styles.banner.info }}>
          <Button style={styles.banner.message} onPress={this.onSynchronize}>
            <Text style={styles.banner.text}>
              <Icon name="info-circle" />{' '}
              {I18n.t('scenes.dashboard.banner.new_sync_data', {
                count: localModificationsCount,
              })}
            </Text>
          </Button>
          <Button style={styles.banner.close} onPress={this.onCloseBanner}>
            <Icon style={styles.banner.closeIcon} name="times" />
          </Button>
        </View>
      );
    }
  }

  /**
   * {@inherit}
   */
  render() {
    const rows = chunk(this.state.items, this.colums);

    return (
      <WrapperView full>
        {this.renderBanner()}
        <FlatList data={rows} renderItem={this.renderRow} keyExtractor={(item, index) => String(index)} scrollEnabled />
      </WrapperView>
    );
  }
}

function DashboardWithSyncGuard({ synchronize, ...remainingProps }) {
  const { checkVersion } = AppVersionGuard.useContext();

  /**
   * Check the app version before synchronizing
   */
  async function onSynchronize() {
    const outdated = await checkVersion();

    if (!outdated) {
      synchronize();
      return true;
    }

    // On outdated version, do not call synchronize.
    // The user will be displayed a blocking screen (see AppVersionGuard).
    return false;
  }

  return <Dashboard {...remainingProps} synchronize={onSynchronize} />;
}

export default connect(
  (state, props) => ({
    chain: props.navigation.getParam('chain'),
    selectedLang: state.authentication.lang,
    localModificationsCount: state.authentication.localModificationsCount,
    lastSynchronization: state.authentication.lastSynchronization,
    plannedInterventionsRemaining: state.authentication.plannedInterventionsRemaining,
    freeUser: state.authentication.userProfile.free,
  }),
  dispatch => ({
    createShipping: type => dispatch(createShipping(type)),
    createIntervention: (target, installation) => dispatch(createIntervention(target, installation)),
    resetIntervention: () => dispatch(resetIntervention()),
    createAnalysis: nature => dispatch(createAnalysis(nature)),
    resetAnalysis: () => dispatch(resetAnalysis()),
    synchronize: () => dispatch(synchronize()),
    logout: () => dispatch(logout()),
  }),
)(DashboardWithSyncGuard);
