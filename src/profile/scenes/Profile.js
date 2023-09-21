import I18n from 'i18n-js';
import Realm from 'realm';
import { navigate, SCENE_SYNC_DETAILS } from 'k2/app/navigation';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import Config from 'react-native-config';
import { get } from 'k2/app/container';
import Icon from 'k2/app/modules/common/components/Icon';
import Loader from 'k2/app/modules/common/components/Loader';
import { changeLanguage, logout, synchronize } from '../../authentication/actions/authenticationActions';
import { margin } from 'k2/app/modules/common/styles/utils';
import IconBadge from 'k2/app/modules/common/components/IconBadge';
import ModalView from 'k2/app/modules/common/components/modal/ModalView';
import { Button } from '../../common/components/form';
import Copyright from 'k2/app/modules/common/components/Copyright';
import MainListView from 'k2/app/modules/common/components/list/MainListView';
import SomethingOrOther from 'package';
import Lang from '../models/Lang';
import AppVersionGuard from 'k2/app/modules/version/components/AppVersionGuard';

class Profile extends Component {
  static propTypes = {
    offline: PropTypes.bool.isRequired,
    synchronize: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    changeLanguage: PropTypes.func.isRequired,
    synchronizing: PropTypes.bool.isRequired,
    userProfile: PropTypes.shape(),
    lastSynchronization: PropTypes.number,
    packageProvider: PropTypes.shape();
    errorCode: PropTypes.string,
    localModificationsCount: PropTypes.number.isRequired,
    selectedLang: PropTypes.string.isRequired,
  };

  static defaultProps = {
    userProfile: null,
    lastSynchronization: null,
    errorCode: null,
  };

  static styles = {
    container: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 20,
    },
    title: {
      color: 'white',
      fontSize: 24,
      fontWeight: '800',
      ...margin(10, 0),
    },
    subtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: 16,
      fontStyle: 'italic',
      marginBottom: 20,
    },
    button: {
      borderWidth: 1,
      borderRadius: 25,
      ...margin(5, 0),
      padding: 0,
    },
    buttonDisabled: {
      borderColor: '#ccc',
    },
    textButton: {
      color: '#fff',
      margin: 12,
      fontSize: 12,
      lineHeight: 14,
      padding: 0,
      fontWeight: '600',
    },
    textButtonDisabled: {
      color: '#ccc',
    },
    spinner: {
      margin: 12,
      height: 14,
      padding: 0,
    },
    warning: {
      label: {
        fontSize: 14,
      },
    },
    legals: {
      flexDirection: 'row',
      marginHorizontal: -8,
    },
    legalsItem: {
      marginHorizontal: 8,
    },
    legalsText: {
      fontSize: 16,
      color: COLOR_PRIMARY,
      textDecorationLine: 'underline',
      marginBottom: 10,
    },
    copyright: {
      color: 'white',
      opacity: 0.6,
      fontSize: 14,
    },
    icon: {
      position: 'absolute',
      right: 15,
      color: 'white',
    },
  };

  constructor() {
    super();

    this.state = {
      displayLanguageModal: false,
    };

    this.showLanguageModal = this.showLanguageModal.bind(this);
    this.hideLanguageModal = this.hideLanguageModal.bind(this);
    this.onChangeLang = this.onChangeLang.bind(this);
    this.onSynchronize = this.onSynchronize.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.renderDevOptions = this.renderDevOptions.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.userProfile !== null;
  }

  /**
   * Show language modal
   */
  showLanguageModal() {
    this.setState({ displayLanguageModal: true });
  }

  /**
   * Hide modal
   */
  hideLanguageModal() {
    this.setState({ displayLanguageModal: false });
  }

  /**
   * Logout user
   */
  onLogout() {
    this.props.logout();
  }

  async onSynchronize(ignoreLastSyncDate = false) {
    // Does only navigate if sync has started
    const shouldNavigate = await this.props.synchronize(ignoreLastSyncDate);

    if (shouldNavigate) {
      navigate(SCENE_SYNC_DETAILS);
    }
  }

  getRealmPath() {
    return get('realm').path;
  }

  clearDatabase() {
    console.info('Clearing database');
    Realm.clearTestState(); // See https://github.com/realm/realm-js/issues/502#issuecomment-228058951
    console.info('Database cleared');
  }

  onChangeLang(value) {
    this.props.changeLanguage(value);
    this.hideLanguageModal();
  }

  /**
   * Render dev tools
   */
  renderDevOptions() {
    if (Config.APP_ENV !== 'development') {
      return null;
    }

    const { styles } = this.constructor;

    return (
      <View>
        <Text style={styles.title}>Dev tools</Text>
        <Button styleName="clear" style={styles.button} onPress={this.clearDatabase}>
          <Text style={styles.textButton}>{'Clear database'.toUpperCase()}</Text>
        </Button>
        <Button styleName="clear" style={styles.button} onPress={() => console.info(this.getRealmPath())}>
          <Text style={styles.textButton}>{'Realm path'.toUpperCase()}</Text>
        </Button>
      </View>
    );
  }

  renderSyncLabel() {
    const { styles } = this.constructor;
    const { offline, synchronizing } = this.props;

    if (synchronizing) {
      return <Loader style={styles.spinner} color={'#ccc'} />;
    }

    return (
      <Text
        style={{
          ...styles.textButton,
          ...(offline ? styles.textButtonDisabled : {}),
        }}
      >
        {I18n.t('scenes.profile.sync').toUpperCase()}
      </Text>
    );
  }

  renderPickerLanguage() {
    const { displayLanguageModal } = this.state;

    return (
      <ModalView
        key="modal"
        visible={displayLanguageModal}
        onCloseModal={this.hideLanguageModal}
        title={I18n.t('scenes.profile.lang_title')}
        full
      >
        <MainListView
          data={Lang.selectables}
          onPressItem={this.onChangeLang}
          renderContent={item => <Text>{Lang.readableFor(item)}</Text>}
          icon={null}
        />
      </ModalView>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const {
      userProfile,
      synchronizing,
      lastSynchronization,
      offline,
      localModificationsCount,
      selectedLang,
      errorCode,
    } = this.props;

    return (
      <View style={styles.container}>
        {this.renderPickerLanguage()}
        <View>
          <Text style={styles.title}>
            {userProfile.firstname} {userProfile.lastname}
          </Text>
          <Text style={styles.subtitle}>{userProfile.position}</Text>
          <Button onPress={this.showLanguageModal} styleName="clear" style={styles.button}>
            <Text style={styles.textButton}>{Lang.readableFor(selectedLang)}</Text>
            <Icon style={styles.icon} name="chevron-down" />
          </Button>
          <IconBadge
            active={errorCode !== null}
            label="!"
            color={COLOR_WARNING}
            style={{
              ...styles.warning,
              ...{
                badge: {
                  right: localModificationsCount > 0 ? 24 : 0,
                },
              },
            }}
          >
            <IconBadge active={localModificationsCount > 0} label={localModificationsCount.toString()}>
              <Button
                styleName="clear"
                style={{
                  ...styles.button,
                  ...(synchronizing ? styles.buttonDisabled : {}),
                }}
                onPress={() => this.onSynchronize(false)}
                onLongPress={() => this.onSynchronize(true)}
                disabled={synchronizing || offline}
              >
                {this.renderSyncLabel()}
              </Button>
            </IconBadge>
          </IconBadge>
          <Button onPress={this.onLogout} styleName="clear" style={styles.button}>
            <Text style={styles.textButton}>{I18n.t('scenes.profile.logout').toUpperCase()}</Text>
          </Button>
        </View>
        {this.renderDevOptions()}
        <View>
          <View style={styles.legals}>
            <TouchableOpacity style={styles.legalsItem} onPress={() => Linking.openURL(Config.PRIVACY_POLICY_URL)}>
              <Text style={styles.legalsText}>{I18n.t('scenes.profile.privacy_policy')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.legalsItem} onPress={() => Linking.openURL(Config.TERMS_URL)}>
              <Text style={styles.legalsText}>{I18n.t('scenes.profile.terms')}</Text>
            </TouchableOpacity>
          </View>
          {lastSynchronization && (
            <Text style={styles.copyright}>
              {I18n.l('date.formats.synchronization', new Date(lastSynchronization))}
            </Text>
          )}
          <Copyright style={styles.copyright} />
        </View>
      </View>
    );
  }
}

function ProfileWithSyncGuard({ synchronize, ...remainingProps }) {
  const { checkVersion } = AppVersionGuard.useContext();

  /**
   * Check the app version before synchronizing
   *
   * @param {Boolean} ignoreLastSyncDate
   */
  async function onSynchronize(ignoreLastSyncDate) {
    const outdated = await checkVersion();

    if (!outdated) {
      synchronize(ignoreLastSyncDate);
      return true;
    }

    // On outdated version, do not call synchronize.
    // The user will be displayed a blocking screen (see AppVersionGuard).
    return false;
  }

  return <Profile {...remainingProps} synchronize={onSynchronize} />;
}

export default connect(
  state => ({
    offline: state.device.offline,
    userProfile: state.authentication.userProfile,
    selectedLang: state.authentication.lang,
    synchronizing: state.authentication.synchronizing,
    lastSynchronization: state.authentication.lastSynchronization,
    localModificationsCount: state.authentication.localModificationsCount,
    errorCode: state.authentication.errorCode,
  }),
  dispatch => ({
    synchronize: ignoreLastSyncDate => dispatch(synchronize(ignoreLastSyncDate)),
    logout: () => dispatch(logout()),
    changeLanguage: lang => dispatch(changeLanguage(lang)),
  }),
)(ProfileWithSyncGuard);
