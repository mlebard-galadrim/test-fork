import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Image, View } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import syncActions from 'k2/app/modules/common/actions/syncActions';
import Button from 'k2/app/modules/common/components/form/Button';
import { backToDashboard } from 'k2/app/navigation';
import ErrorMessage from 'k2/app/modules/common/components/ErrorMessage';
import Text from 'k2/app/modules/common/components/Text';
import successIcon from 'k2/app/assets/icons/check.png';
import errorIcon from 'k2/app/assets/icons/error.png';
import warningIcon from 'k2/app/assets/icons/warning.png';
import {
  COLOR_ERROR,
  COLOR_LIGHT_BG,
  COLOR_SECONDARY,
  COLOR_SUCCESS,
  COLOR_WARNING,
  GUTTER,
} from 'k2/app/modules/common/styles/vars';
import { padding } from 'k2/app/modules/common/styles/utils';
import { ucfirst } from 'k2/app/modules/common/styles/strings';
import { logout as logoutAction } from 'k2/app/modules/authentication/actions/authenticationActions';
import { localize, trans } from 'k2/app/I18n';

SyncDetails.propTypes = {
  autoCloseOnSuccess: PropTypes.bool,
  onClose: PropTypes.func,
  offline: PropTypes.bool.isRequired,
  sync: PropTypes.shape({
    preparingData: PropTypes.bool.isRequired,
    preparingDataSucceeded: PropTypes.bool,
    sendDataErrorReport: PropTypes.bool.isRequired,
    sendDataErrorReportSucceeded: PropTypes.bool,
    sendData: PropTypes.bool.isRequired,
    sendDataSucceeded: PropTypes.bool,
    sendDataPartialFailures: PropTypes.bool.isRequired,
    downloadData: PropTypes.bool.isRequired,
    downloadDataStep: PropTypes.string,
    downloadDataSliceNb: PropTypes.number,
    downloadDataSucceeded: PropTypes.bool,
    processData: PropTypes.bool.isRequired,
    processDataSucceeded: PropTypes.bool,
  }).isRequired,
  authentication: PropTypes.shape({
    refreshTokens: PropTypes.bool.isRequired,
    refreshTokensSucceeded: PropTypes.bool,
  }).isRequired,
  synchronizing: PropTypes.bool.isRequired,
  lastSynchronization: PropTypes.number,
};

SyncDetails.defaultProps = {
  onClose: null,
  autoCloseOnSuccess: false,
  lastSynchronization: null,
  preparingDataSucceeded: null,
  sendDataErrorReportSucceeded: null,
  sendDataSucceeded: null,
  downloadDataSucceeded: null,
  downloadDataStep: null,
  downloadDataSliceNb: null,
  processDataSucceeded: null,
  refreshTokensSucceeded: null,
};

function SyncDetails({
  authentication,
  autoCloseOnSuccess,
  lastSynchronization,
  offline,
  onClose,
  sync,
  synchronizing,
}) {
  const t = (key, placeholders = {}) => trans(`scenes.sync_details.${key}`, placeholders);
  const { styles } = SyncDetails;

  const dispatch = useDispatch();
  const resetSync = useCallback(() => dispatch(syncActions.reset()), [dispatch]);
  const logout = useCallback(() => dispatch(logoutAction()), [dispatch]);

  const {
    preparingData,
    preparingDataSucceeded,
    processData,
    processDataStep,
    processDataSucceeded,
    downloadData,
    downloadDataStep,
    downloadDataSliceNb,
    downloadDataSucceeded,
    sendData,
    sendDataErrorReportSucceeded,
    sendDataSucceeded,
    sendDataErrorReport,
    sendDataPartialFailures,
  } = sync;

  const isLoading = useMemo(
    () => synchronizing || authentication.refreshTokens,
    [synchronizing, authentication.refreshTokens],
  );

  const isWarning = useMemo(
    () => sendDataSucceeded === false && sendDataPartialFailures === true,
    [sendDataSucceeded, sendDataPartialFailures],
  );

  const isFailure = useMemo(
    () =>
      preparingDataSucceeded === false ||
      sendDataErrorReportSucceeded === false ||
      (sendDataSucceeded === false && !sendDataPartialFailures) ||
      downloadDataSucceeded === false ||
      processDataSucceeded === false ||
      authentication.refreshTokensSucceeded === false,
    [
      preparingDataSucceeded,
      sendDataErrorReportSucceeded,
      sendDataSucceeded,
      downloadDataSucceeded,
      processDataSucceeded,
      sendDataPartialFailures,
      authentication.refreshTokensSucceeded,
    ],
  );

  const isEnded = useMemo(() => {
    if (processDataSucceeded === true) {
      // Data were processed successfully, indicating the whole sync was done with success
      return true;
    }

    // end on any failure but prepare (as we'll continue to download):
    return (
      sendDataErrorReportSucceeded === false ||
      (sendDataSucceeded === false && !sendDataPartialFailures) ||
      downloadDataSucceeded === false ||
      processDataSucceeded === false
    );
  }, [
    processDataSucceeded,
    sendDataErrorReportSucceeded,
    sendDataSucceeded,
    downloadDataSucceeded,
    sendDataPartialFailures,
  ]);

  const close = useCallback(() => {
    resetSync();
    onClose ? onClose() : backToDashboard();
  }, [onClose, resetSync]);

  /**
   * If all data were processed without warning, autoclose if asked to:
   */
  useEffect(() => {
    if (autoCloseOnSuccess && processDataSucceeded && !isWarning && !isFailure) {
      close();
    }
  }, [autoCloseOnSuccess, processDataSucceeded, isWarning, isFailure, close]);

  function renderIcon() {
    const { styles } = SyncDetails;

    if (isLoading) {
      return (
        <View style={styles.icon}>
          <ActivityIndicator size="large" color={COLOR_SECONDARY} style={styles.loader} />
        </View>
      );
    }

    if (isWarning) {
      return (
        <View style={styles.icon}>
          <Image style={styles.iconImage} source={warningIcon} />
        </View>
      );
    }

    if (isFailure) {
      return (
        <View style={styles.icon}>
          <Image style={styles.iconImage} source={errorIcon} />
        </View>
      );
    }

    // Otherwise it's successful:
    return (
      <View style={styles.icon}>
        <Image style={styles.iconImage} source={successIcon} />
      </View>
    );
  }

  if (offline) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <Step status={'error'}>{t('no_network')}</Step>
        </View>

        <Button style={styles.closeButton} onPress={close}>
          {t('actions.try_later')}
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.content}>
        {renderIcon()}

        {lastSynchronization && (
          <Text style={styles.lastSync}>
            {localize('date.formats.last_sync_details', new Date(lastSynchronization))}
          </Text>
        )}

        {/* check auth & refresh token */}
        {authentication.refreshTokens && <Step>{t('steps.check_auth.doing')}</Step>}
        {authentication.refreshTokensSucceeded === true && (
          <Step status={'success'}>{t('steps.check_auth.success')}</Step>
        )}
        {authentication.refreshTokensSucceeded === false && <Step status={'error'}>{t('steps.check_auth.fail')}</Step>}

        {/* prepare */}
        {preparingData && <Step>{t('steps.prepare.doing')}</Step>}
        {preparingDataSucceeded === true && <Step status={'success'}>{t('steps.prepare.success')}</Step>}
        {preparingDataSucceeded === false && (
          <Step status={'error'}>{ErrorMessage.create(t('steps.prepare.fail'))}</Step>
        )}

        {/* data report on issues preparing data */}
        {sendDataErrorReport && <Step>{t('steps.send_data_error_report.doing')}</Step>}
        {sendDataErrorReportSucceeded === true && (
          <Step status={'success'}>{t('steps.send_data_error_report.success')}</Step>
        )}
        {sendDataErrorReportSucceeded === false && (
          <Step status={'error'}>{ErrorMessage.create(t('steps.send_data_error_report.fail'))}</Step>
        )}

        {/* send */}
        {sendData && <Step>{t('steps.send_data.doing')}</Step>}
        {sendDataSucceeded === true && <Step status={'success'}>{t('steps.send_data.success')}</Step>}
        {sendDataSucceeded === false &&
          (sendDataPartialFailures === true ? (
            <Step status={'warning'}>{ErrorMessage.create(t('steps.send_data.warning'), true)}</Step>
          ) : (
            <Step status={'error'}>{ErrorMessage.create(t('steps.send_data.fail'))}</Step>
          ))}

        {/* download */}
        {downloadData && (
          <Step>
            <Text>
              {downloadDataStep
                ? downloadDataSliceNb !== null
                  ? t('steps.download_data.doing_with_step_and_slice', {
                    step: t(`data_steps.${downloadDataStep}`),
                    sliceNb: downloadDataSliceNb,
                  })
                  : t('steps.download_data.doing_with_step', {
                    step: t(`data_steps.${downloadDataStep}`),
                  })
                : t('steps.download_data.doing')}
            </Text>
          </Step>
        )}
        {downloadDataSucceeded === true && <Step status={'success'}>{t('steps.download_data.success')}</Step>}

        {downloadDataSucceeded === false && (
          <Step status={'error'}>
            {ErrorMessage.create(
              downloadDataStep
                ? t('steps.download_data.fail_with_step', {
                  step: t(`data_steps.${downloadDataStep}`),
                })
                : t('steps.download_data.fail'),
            )}
          </Step>
        )}

        {/* process */}
        {downloadDataSucceeded === true && processData && (
          <Step>
            <Text>
              {processDataStep
                ? t('steps.process_data.doing_with_step', {
                  step: t(`data_steps.${processDataStep}`),
                })
                : t('steps.process_data.doing')}
            </Text>
          </Step>
        )}
        {processDataSucceeded === true && <Step status={'success'}>{t('steps.process_data.success')}</Step>}
        {processDataSucceeded === false && (
          <Step status={'error'}>
            {ErrorMessage.create(
              processDataStep
                ? t('steps.process_data.fail_with_step', {
                  step: t(`data_steps.${processDataStep}`),
                })
                : t('steps.process_data.fail'),
            )}
          </Step>
        )}
      </View>

      {/* end of sync */}
      {isEnded && (
        <Button style={styles.closeButton} onPress={close}>
          {t('actions.back_to_dashboard')}
        </Button>
      )}

      {/* Logout btn on failed auth checks */}
      {authentication.refreshTokensSucceeded === false && (
        <Button style={styles.closeButton} onPress={logout}>
          {t('actions.logout')}
        </Button>
      )}
    </View>
  );
}

export default connect(state => ({
  sync: state.sync,
  offline: state.device.offline,
  synchronizing: state.authentication.synchronizing,
  authentication: state.authentication,
  lastSynchronization: state.authentication.lastSynchronization,
}))(SyncDetails);

SyncDetails.styles = {
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    margin: GUTTER * 2,
  },
  lastSync: {
    alignSelf: 'center',
    ...padding(10),
    marginBottom: 10,
  },
  icon: {
    flex: 0,
    margin: GUTTER * 2,
    alignSelf: 'center',
  },
  iconImage: {
    width: 226 / 2,
    height: 226 / 2,
  },
  loader: {
    width: 226 / 2,
    height: 226 / 2,
  },
  closeButton: {
    flex: 0,
    borderRadius: 0,
  },
};

Step.propTypes = {
  children: PropTypes.node.isRequired,
  status: PropTypes.oneOf(['success', 'error', 'warning']),
};

Step.defaultProps = {
  status: null,
};

Step.styles = {
  container: {
    ...padding(10),
    borderStyle: 'solid',
    borderLeftWidth: 5,
    marginBottom: 1,
    borderColor: COLOR_LIGHT_BG,
  },
  containerSuccess: {
    borderColor: COLOR_SUCCESS,
  },
  containerError: {
    borderColor: COLOR_ERROR,
  },
  containerWarning: {
    borderColor: COLOR_WARNING,
  },
  text: {},
};

function Step({ status, children }) {
  const { styles } = Step;

  return (
    <View
      style={{
        ...styles.container,
        ...((status && styles['container' + ucfirst(status)]) || {}),
      }}
    >
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}
