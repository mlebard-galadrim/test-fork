import {
  INTERVENTION_REPORT_ADD_INTERVENTION_TO_EXISTING_REPORT,
  INTERVENTION_REPORT_CLOSE,
  INTERVENTION_REPORT_EDIT,
  INTERVENTION_REPORT_RESET,
  INTERVENTION_REPORT_SAVE,
  INTERVENTION_REPORT_SELECT_INTERVENTIONS,
  INTERVENTION_REPORT_SET_BILLING_SITE,
  INTERVENTION_REPORT_SET_INFO,
  INTERVENTION_REPORT_START,
} from 'k2/app/modules/intervention_report/actions/interventionReportActions';

const initialState = {
  // In case of edition, the existing report is set:
  /** @type {InterventionReport} */
  currentReport: null,

  // These are the base context for creating an intervention report:
  /** @type {Date|null} */
  date: null,
  /** @type {Site|null} */
  site: null,

  // These are the information provided by the user:
  /** @type {String|null} */
  reportNumber: null,
  /** @type {Intervention[]} */
  interventions: Object.freeze([]),
  /** @type {Date|null} */
  roundTripGoStartDate: null,
  /** @type {Date|null} */
  roundTripGoEndDate: null,
  /** @type {Number|null} */
  roundTripGoDistance: null,
  /** @type {Date|null} */
  roundTripReturnStartDate: null,
  /** @type {Date|null} */
  roundTripReturnEndDate: null,
  /** @type {Number|null} */
  roundTripReturnDistance: null,
  /** @type {Date|null} */
  startDate: null,
  /** @type {Date|null} */
  endDate: null,

  /** @type {Site|null} */
  billingSite: null,

  /** @type {String|null} */
  comment: null,
  /** @type {String|null} */
  operatorSignature: null,
  /** @type {String|null} */
  clientSignature: null,
};

/**
 * @param {Object} state
 * @param {Object} action
 *
 * @return {Object}
 */
export default function (state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case INTERVENTION_REPORT_RESET:
      return initialState;

    case INTERVENTION_REPORT_START:
      return { ...initialState, site: payload.site, date: payload.date };

    case INTERVENTION_REPORT_EDIT:
      let report = payload.report;

      return {
        ...initialState,
        currentReport: report,
        // Pre-populate data with existing report:
        site: payload.site,
        date: payload.date,
        reportNumber: report.reportNumber,
        interventions: Array.from(report.interventions),
        roundTripGoStartDate: report.roundTripGoStartDate,
        roundTripGoEndDate: report.roundTripGoEndDate,
        roundTripGoDistance: report.roundTripGoDistance,
        roundTripReturnStartDate: report.roundTripReturnStartDate,
        roundTripReturnEndDate: report.roundTripReturnEndDate,
        roundTripReturnDistance: report.roundTripReturnDistance,
        startDate: report.startDate,
        endDate: report.endDate,
        billingSite: report.billingSite,
        comment: report.comment,
        operatorSignature: report.operatorSignature,
        clientSignature: report.clientSignature,
      };

    case INTERVENTION_REPORT_SELECT_INTERVENTIONS:
      return { ...state, interventions: payload.interventions };

    case INTERVENTION_REPORT_SET_INFO:
      return {
        ...state,
        reportNumber: payload.reportNumber,
        roundTripGoStartDate: payload.roundTripGoStartDate,
        roundTripGoEndDate: payload.roundTripGoEndDate,
        roundTripGoDistance: payload.roundTripGoDistance,
        roundTripReturnStartDate: payload.roundTripReturnStartDate,
        roundTripReturnEndDate: payload.roundTripReturnEndDate,
        roundTripReturnDistance: payload.roundTripReturnDistance,
        startDate: payload.startDate,
        endDate: payload.endDate,
      };

    case INTERVENTION_REPORT_SET_BILLING_SITE:
      return { ...state, billingSite: payload.billingSite };

    case INTERVENTION_REPORT_SAVE:
    case INTERVENTION_REPORT_CLOSE:
    case INTERVENTION_REPORT_ADD_INTERVENTION_TO_EXISTING_REPORT:
    default:
      return state;
  }
}
