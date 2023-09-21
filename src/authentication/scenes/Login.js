import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Linking, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Config from 'react-native-config';
import { get } from 'k2/app/container';
import View from 'k2/app/modules/common/components/View';
import { BigButton, BlockTextInput } from 'k2/app/modules/common/components/form';
import ErrorMessage from 'k2/app/modules/common/components/ErrorMessage';
import { COLOR_LIGHT_BG, COLOR_PRIMARY, COLOR_UNDERLAY } from 'k2/app/modules/common/styles/vars';
import Logo from 'k2/app/modules/common/components/Logo';
import OfflineAlert from 'k2/app/modules/device/components/OfflineAlert';
import Copyright from 'k2/app/modules/common/components/Copyright';
import { login } from '../actions/authenticationActions';
import { TimeoutError } from '../../common/api/ApiClient';
import { trans } from 'k2/app/I18n';

const DOWNLOAD_SIZE_MB = 50;

export default function Login() {
  const dispatch = useDispatch();

  const { errorCode, error } = useSelector(state => state.authentication);
  const { offline } = useSelector(state => state.device);

  const [loading, setLoading] = useState(false);
  const [confirmedDownload, setConfirmedDownload] = useState(false);
  const [username, setUsername] = useState(Config.USERNAME || '');
  const [password, setPassword] = useState(Config.PASSWORD || '');

  const isValid = username?.length && password?.length;

  const { styles } = Login;
  const ios = Platform.OS === 'ios';
  const behavior = ios ? 'padding' : undefined;
  const inputStyle = {
    ...styles.input,
    ...(errorCode ? { borderWidth: 1, borderColor: '#cc453b' } : {}),
  };

  function onPressLogin() {
    if (!isValid) {
      return;
    }

    confirmLogin();
  }

  /**
   * Discloses the approximative required data download size to the user, and ask for confirmation before sync.
   *
   * Required from Apple
   * as of {@link https://developer.apple.com/app-store/review/guidelines/#minimum-functionality "4.2.3 Minimum Functionality"}
   */
  function confirmLogin() {
    // Do only ask once:
    if (confirmedDownload) {
      doLogin();
      return;
    }

    Alert.alert(
      trans('scenes.login.discloseDownloadSize.title'),
      trans('scenes.login.discloseDownloadSize.content', {
        downloadSizeMb: DOWNLOAD_SIZE_MB,
      }),
      [
        {
          text: trans('scenes.login.discloseDownloadSize.confirm'),
          onPress: () => {
            setConfirmedDownload(true);
            doLogin();
          },
        },
        {
          text: trans('common.cancel'),
          onPress: () => {}, // Noop. Downloading data from the API is required to use the app.
          style: 'cancel',
        },
      ],
    );
  }

  async function doLogin() {
    setLoading(true);

    try {
      await dispatch(login(username, password));
      get('firebase-analytics').logEvent('login');
    } catch {
      setLoading(false);
    }
  }

  return (
    <View style={styles.wrapper}>
      <KeyboardAvoidingView behavior={behavior} style={styles.content} enabled>
        <OfflineAlert />
        <Logo />
        <View styleName="horizontal">
          <BlockTextInput
            defaultValue={username}
            onChangeText={username => setUsername(username)}
            placeholder={trans('scenes.login.username')}
            keyboardType="email-address"
            style={inputStyle}
          />
        </View>
        <View styleName="horizontal">
          <BlockTextInput
            defaultValue={password}
            onChangeText={password => setPassword(password)}
            placeholder={trans('scenes.login.password')}
            onSubmitEditing={!offline && isValid ? onPressLogin : () => {}}
            secureTextEntry
            style={inputStyle}
          />
        </View>
        {errorCode && ErrorMessage.create(trans(`scenes.login.error.${errorCode}`))}
        <LoginError error={error} />
        <BigButton
          disabled={offline || !isValid}
          loading={loading}
          style={{
            ...styles.button,
            ...(offline || !isValid ? styles.buttonDisabled : null),
          }}
          textColor={COLOR_PRIMARY}
          disabledColor={COLOR_UNDERLAY}
          onPress={onPressLogin}
          label={trans('scenes.login.validate')}
        />
        <BigButton
          disabled={offline}
          style={styles.buttonInline}
          inline
          color={COLOR_UNDERLAY}
          onPress={() => Linking.openURL(Config.FORGOT_PASSWORD_URL)}
          label={trans('scenes.login.forgot_password')}
        />
        {!ios && (
          <BigButton
            disabled={offline}
            style={styles.buttonInline}
            inline
            color={COLOR_UNDERLAY}
            onPress={() => Linking.openURL(Config.CONTACT_URL)}
            label={trans('scenes.login.contact')}
          />
        )}
        <Copyright style={styles.copyright} />
      </KeyboardAvoidingView>
    </View>
  );
}

Login.styles = {
  wrapper: {
    flex: 1,
    backgroundColor: COLOR_PRIMARY,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 40,
  },
  input: {
    flex: 1,
    borderRadius: 5,
    padding: 20,
    marginTop: 20,
    backgroundColor: COLOR_LIGHT_BG,
  },
  button: {
    marginTop: 20,
    borderColor: COLOR_PRIMARY,
  },
  buttonInline: {
    marginTop: 10,
  },
  copyright: {
    marginTop: 40,
  },
};

function LoginError({ error }) {
  if (!error) {
    return null;
  }

  if (error instanceof TimeoutError) {
    return ErrorMessage.create(trans('scenes.login.error.timeout'));
  }

  return ErrorMessage.create(trans('scenes.login.error.generic'));
}
