import sync from '../actions/syncActions';

const initialState = {
  // Prepare
  preparingData: false,
  preparingDataStep: null,
  preparingDataSucceeded: null,

  // Send
  sendData: false,
  sendDataSucceeded: null,
  sendDataPartialFailures: false,

  // Error report to send to the API on data issue
  sendDataErrorReport: false,
  sendDataErrorReportSucceeded: null,

  // Download
  downloadData: false,
  downloadDataStep: null,
  downloadDataSliceNb: null,
  downloadDataSucceeded: null,

  // Process
  processData: false,
  processDataStep: null,
  processDataSucceeded: null,
};

/**
 * Sync reducer
 *
 * @param {Object} state
 * @param {Object} action
 *
 * @return {Object}
 */
export default function (state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case sync.RESET:
      return {
        ...initialState, // Reset the whole state
      };

    // prepare
    case sync.PREPARE_DATA:
      return {
        ...initialState, // Reset the whole state
        preparingData: true,
        preparingDataStep: payload.step,
        preparingDataSucceeded: null,
      };

    case sync.PREPARE_DATA_SUCCEEDED:
      return {
        ...state,
        preparingData: false,
        preparingDataStep: null,
        preparingDataSucceeded: true,
      };

    case sync.PREPARE_DATA_FAILED:
      return {
        ...state,
        preparingData: false,
        preparingDataSucceeded: false,
      };

    // prepare data error report
    case sync.SEND_DATA_ERROR_REPORT:
      return {
        ...state,
        sendDataErrorReport: true,
        sendDataErrorReportSucceeded: null,
      };

    case sync.SEND_DATA_ERROR_REPORT_SUCCEEDED:
      return {
        ...state,
        sendDataErrorReport: false,
        sendDataErrorReportSucceeded: true,
      };

    case sync.SEND_DATA_ERROR_REPORT_FAILED:
      return {
        ...state,
        sendDataErrorReport: false,
        sendDataErrorReportSucceeded: false,
      };

    // send
    case sync.SEND_DATA:
      return {
        ...state,
        sendData: true,
        sendDataSucceeded: null,
        sendDataPartialFailures: false,
      };

    case sync.SEND_DATA_SUCCEEDED:
      return {
        ...state,
        sendData: false,
        sendDataSucceeded: true,
        sendDataPartialFailures: false,
      };

    case sync.SEND_DATA_FAILED:
      return {
        ...state,
        sendData: false,
        sendDataSucceeded: false,
        sendDataPartialFailures: payload.partial,
      };

    // download
    case sync.DOWNLOAD_DATA:
      return {
        ...state,
        downloadData: true,
        downloadDataStep: payload.step,
        downloadDataSliceNb: payload.sliceNb ?? null,
        downloadDataSucceeded: null,
        // remove previous processing step since a new download started, so processing is over
        processData: false,
        processDataStep: null,
      };

    case sync.DOWNLOAD_DATA_SUCCEEDED:
      return {
        ...state,
        downloadData: false,
        downloadDataStep: null,
        downloadDataSucceeded: true,
      };

    case sync.DOWNLOAD_DATA_FAILED:
      return {
        ...state,
        downloadData: false,
        downloadDataSucceeded: false,
      };

    // process
    case sync.PROCESS_DATA:
      return {
        ...state,
        processData: true,
        processDataStep: payload.step,
        processDataSucceeded: null,
      };

    case sync.PROCESS_DATA_SUCCEEDED:
      return {
        ...state,
        processData: false,
        processDataStep: null,
        processDataSucceeded: true,
      };

    case sync.PROCESS_DATA_FAILED:
      return {
        ...state,
        processData: false,
        processDataSucceeded: false,
      };

    default:
      return state;
  }
}
