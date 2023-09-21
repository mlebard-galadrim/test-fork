import { get } from '../../../container';
import * as Sentry from '@sentry/react-native';

/**
 * @see https://docs.sentry.io/enriching-error-data/breadcrumbs/?platform=javascript
 */
export function addSentryBreadcrumb(level, message, action, extraData) {
  Sentry.addBreadcrumb({
    category: 'sync',
    message,
    data: {
      action,
      ...extraData,
    },
    level,
  });
}

const sync = {
  RESET: 'SYNC_RESET',

  reset() {
    return dispatch =>
      dispatch({
        type: this.RESET,
      });
  },

  // prepare
  PREPARE_DATA: 'SYNC_PREPARE_DATA',
  PREPARE_DATA_SUCCEEDED: 'SYNC_PREPARE_DATA_SUCCEEDED',
  PREPARE_DATA_FAILED: 'SYNC_PREPARE_DATA_FAILED',

  prepareData(step = null) {
    return dispatch => {
      addSentryBreadcrumb(Sentry.Severity.Info, 'Preparing data...', 'prepareData', {
        step,
      });

      return dispatch({
        type: this.PREPARE_DATA,
        payload: { step },
      });
    };
  },

  prepareDataSucceeded() {
    return dispatch => {
      addSentryBreadcrumb(Sentry.Severity.Info, 'Preparing data succeeded', 'prepareDataSucceeded');

      return dispatch({
        type: this.PREPARE_DATA_SUCCEEDED,
      });
    };
  },

  prepareDataFailed() {
    return (dispatch, getState) => {
      const step = getState().sync.preparingDataStep;

      get('firebase-analytics').logEvent('sync_prepare_data_failed', {
        step,
      });
      addSentryBreadcrumb(Sentry.Severity.Error, 'Preparing data failed', 'prepareDataFailed', { step });

      return dispatch({
        type: this.PREPARE_DATA_FAILED,
      });
    };
  },

  // prepare data error report
  SEND_DATA_ERROR_REPORT: 'DATA_ERROR_REPORT',
  SEND_DATA_ERROR_REPORT_SUCCEEDED: 'DATA_ERROR_REPORT_SUCCEEDED',
  SEND_DATA_ERROR_REPORT_FAILED: 'DATA_ERROR_REPORT_FAILED',

  sendDataErrorReport() {
    get('firebase-analytics').logEvent('sync_send_data_error_report');
    addSentryBreadcrumb(Sentry.Severity.Info, 'Sending data error report...', 'sendDataErrorReport');

    return dispatch => {
      return dispatch({
        type: this.SEND_DATA_ERROR_REPORT,
      });
    };
  },

  sendDataErrorReportSucceeded() {
    return dispatch => {
      get('firebase-analytics').logEvent('sync_send_data_error_report_success');
      addSentryBreadcrumb(Sentry.Severity.Info, 'Sending data error succeeded', 'sendDataErrorReportSucceeded');

      return dispatch({
        type: this.SEND_DATA_ERROR_REPORT_SUCCEEDED,
      });
    };
  },

  sendDataErrorReportFailed() {
    return dispatch => {
      get('firebase-analytics').logEvent('sync_send_data_error_report_failed');
      addSentryBreadcrumb(Sentry.Severity.Error, 'Sending data error failed', 'sendDataErrorReportFailed');

      return dispatch({
        type: this.SEND_DATA_ERROR_REPORT_FAILED,
      });
    };
  },

  // send
  SEND_DATA: 'SYNC_SEND_DATA',
  SEND_DATA_SUCCEEDED: 'SYNC_SEND_DATA_SUCCEEDED',
  SEND_DATA_FAILED: 'SYNC_SEND_DATA_FAILED',

  sendData() {
    return dispatch => {
      addSentryBreadcrumb(Sentry.Severity.Info, 'Sending data...', 'sendData');

      return dispatch({
        type: this.SEND_DATA,
      });
    };
  },

  sendDataSucceeded() {
    return dispatch => {
      addSentryBreadcrumb(Sentry.Severity.Info, 'Sending data succeeded', 'sendDataSucceeded');

      return dispatch({
        type: this.SEND_DATA_SUCCEEDED,
      });
    };
  },

  /**
   * @param {Boolean} partial True if the APi received & processed the data,
   *                          but some of those failed (due to validation errors for instance),
   */
  sendDataFailed(partial = false) {
    return dispatch => {
      get('firebase-analytics').logEvent(partial ? 'sync_send_data_partial_failed' : 'sync_send_data_failed');
      addSentryBreadcrumb(
        Sentry.Severity.Error,
        partial ? 'Sending data partially failed' : 'Sending data failed',
        'sendDataFailed',
        { partial },
      );

      return dispatch({
        type: this.SEND_DATA_FAILED,
        payload: { partial },
      });
    };
  },

  // download
  DOWNLOAD_DATA: 'SYNC_DOWNLOAD_DATA',
  DOWNLOAD_DATA_SUCCEEDED: 'SYNC_DOWNLOAD_DATA_SUCCEEDED',
  DOWNLOAD_DATA_FAILED: 'SYNC_DOWNLOAD_DATA_FAILED',

  downloadData(step = null, sliceNb = null) {
    addSentryBreadcrumb(Sentry.Severity.Info, 'Downloading data...', 'downloadData', { step });

    return dispatch =>
      dispatch({
        type: this.DOWNLOAD_DATA,
        payload: { step, sliceNb },
      });
  },

  downloadDataSucceeded() {
    return dispatch => {
      addSentryBreadcrumb(Sentry.Severity.Info, 'Downloading data succeeded', 'downloadDataSucceeded');

      return dispatch({
        type: this.DOWNLOAD_DATA_SUCCEEDED,
      });
    };
  },

  downloadDataFailed() {
    return (dispatch, getState) => {
      const step = getState().sync.downloadDataStep;

      get('firebase-analytics').logEvent('sync_download_data_failed', {
        step,
      });
      addSentryBreadcrumb(Sentry.Severity.Error, 'Downloading data failed', 'downloadDataFailed', { step });

      return dispatch({
        type: this.DOWNLOAD_DATA_FAILED,
      });
    };
  },

  // process
  PROCESS_DATA: 'SYNC_PROCESS_DATA',
  PROCESS_DATA_SUCCEEDED: 'SYNC_PROCESS_DATA_SUCCEEDED',
  PROCESS_DATA_FAILED: 'SYNC_PROCESS_DATA_FAILED',

  processData(step = null) {
    return dispatch => {
      addSentryBreadcrumb(Sentry.Severity.Info, 'Processing data...', 'processData');

      return dispatch({
        type: this.PROCESS_DATA,
        payload: { step },
      });
    };
  },

  processDataSucceeded() {
    return dispatch => {
      addSentryBreadcrumb(Sentry.Severity.Info, 'Processing data succeeded', 'processDataSucceeded');

      dispatch({
        type: this.PROCESS_DATA_SUCCEEDED,
      });
    };
  },

  processDataFailed() {
    return (dispatch, getState) => {
      const step = getState().sync.processDataStep;

      get('firebase-analytics').logEvent('sync_process_data_failed', {
        step,
      });
      addSentryBreadcrumb(Sentry.Severity.Error, 'Processing data failed', 'processData', { step });

      return dispatch({
        type: this.PROCESS_DATA_FAILED,
      });
    };
  },
};

export default sync;
