import { get } from 'k2/app/container';
import { updateLocalModificationCount } from 'k2/app/modules/authentication/actions/authenticationActions';
import InterventionReport from 'k2/app/modules/intervention_report/model/InterventionReport';
import Intervention from 'k2/app/modules/intervention/models/Intervention';
import { shallowCloneRealmObject } from '../../common/utils/shallowCloneRealmObject';

export const INTERVENTION_REPORT_RESET = 'INTERVENTION_REPORT_RESET';
export const INTERVENTION_REPORT_START = 'INTERVENTION_REPORT_START';
export const INTERVENTION_REPORT_EDIT = 'INTERVENTION_REPORT_EDIT';
export const INTERVENTION_REPORT_ADD_INTERVENTION_TO_EXISTING_REPORT =
  'INTERVENTION_REPORT_ADD_INTERVENTION_TO_EXISTING_REPORT';
export const INTERVENTION_REPORT_SELECT_INTERVENTIONS = 'INTERVENTION_REPORT_SELECT_INTERVENTIONS';
export const INTERVENTION_REPORT_SET_INFO = 'INTERVENTION_REPORT_SET_INFO';
export const INTERVENTION_REPORT_SET_BILLING_SITE = 'INTERVENTION_REPORT_SET_BILLING_SITE';
export const INTERVENTION_REPORT_SAVE = 'INTERVENTION_REPORT_SAVE';
export const INTERVENTION_REPORT_CLOSE = 'INTERVENTION_REPORT_CLOSE';

export function start(site, date) {
  return dispatch =>
    dispatch({
      type: INTERVENTION_REPORT_START,
      payload: { site, date },
    });
}

/**
 * Pre-populate the reducers with existing report data for edition.
 *
 * @param {InterventionReport} report
 */
export function edit(report) {
  /** @type {InstallationRepository} */
  const installationRepository = get('installation_repository');

  return dispatch =>
    dispatch({
      type: INTERVENTION_REPORT_EDIT,
      payload: {
        report,
        date: report.interventions[0].creation,
        site: installationRepository.find(report.interventions[0].installation).site,
      },
    });
}

export function selectInterventions(interventions) {
  return dispatch =>
    dispatch({
      type: INTERVENTION_REPORT_SELECT_INTERVENTIONS,
      payload: { interventions },
    });
}

/**
 * Add a newly created intervention to an existing & opened report for the same site and day.
 *
 * @param {Intervention} intervention
 * @param {InterventionReport} report
 */
export function addInterventionToExistingReport(intervention, report) {
  return dispatch => {
    dispatch({ type: INTERVENTION_REPORT_ADD_INTERVENTION_TO_EXISTING_REPORT, payload: { intervention, report } });

    /** @type {Realm} */
    const realm = get('realm');
    realm.write(() => {
      report.updateCreatedAt();
      report.interventions.push(
        // Reloading from Realm to get a managed instance:
        realm.objectForPrimaryKey(Intervention.schema.name, intervention.id),
      );
    });
  };
}

/**
 * @param {String|null} reportNumber
 * @param {Date|null} roundTripGoStartDate
 * @param {Date|null} roundTripGoEndDate
 * @param {Number|null} roundTripGoDistance
 * @param {Date|null} roundTripReturnStartDate
 * @param {Date|null} roundTripReturnEndDate
 * @param {Number|null} roundTripReturnDistance
 * @param {Date|null} startDate
 * @param {Date|null} endDate
 */
export function setInfo({
  reportNumber,
  roundTripGoStartDate,
  roundTripGoEndDate,
  roundTripGoDistance,
  roundTripReturnStartDate,
  roundTripReturnEndDate,
  roundTripReturnDistance,
  startDate,
  endDate,
}) {
  return dispatch =>
    dispatch({
      type: INTERVENTION_REPORT_SET_INFO,
      payload: {
        reportNumber,
        roundTripGoStartDate,
        roundTripGoEndDate,
        roundTripGoDistance,
        roundTripReturnStartDate,
        roundTripReturnEndDate,
        roundTripReturnDistance,
        startDate,
        endDate,
      },
    });
}

/**
 * @param {Site|null} billingSite
 */
export function setBillingSite(billingSite) {
  return dispatch =>
    dispatch({
      type: INTERVENTION_REPORT_SET_BILLING_SITE,
      payload: { billingSite },
    });
}

/**
 * @property {String|null} comment
 * @property {String} operatorSignature
 * @property {String|null} clientSignature
 * @property {Boolean} saveAndClose Whether to close or not the report at the same time
 */
export function save({ comment = null, operatorSignature, clientSignature = null }, saveAndClose = false) {
  return (dispatch, getState) => {
    dispatch({ type: INTERVENTION_REPORT_SAVE });

    const {
      currentReport,
      site,
      date,
      reportNumber,
      interventions,
      roundTripGoStartDate,
      roundTripGoEndDate,
      roundTripGoDistance,
      roundTripReturnStartDate,
      roundTripReturnEndDate,
      roundTripReturnDistance,
      startDate,
      endDate,
      billingSite,
    } = getState().interventionReportReducer;

    const interventionReportRepository = get('intervention_report_repository');

    const report = interventionReportRepository.save(() => {
      if (currentReport) {
        // Edit current report:
        currentReport.updateCreatedAt();

        return {
          ...shallowCloneRealmObject(currentReport),
          reportNumber,
          interventions,
          roundTripGoStartDate,
          roundTripGoEndDate,
          roundTripGoDistance,
          roundTripReturnStartDate,
          roundTripReturnEndDate,
          roundTripReturnDistance,
          startDate,
          endDate,
          billingSite,
          comment,
          operatorSignature,
          clientSignature,
        };
      }

      // Save as new report:
      return InterventionReport.create(
        site,
        date,
        reportNumber,
        interventions,
        roundTripGoStartDate,
        roundTripGoEndDate,
        roundTripGoDistance,
        roundTripReturnStartDate,
        roundTripReturnEndDate,
        roundTripReturnDistance,
        startDate,
        endDate,
        billingSite,
        comment,
        operatorSignature,
        clientSignature,
      );
    });

    if (saveAndClose) {
      dispatch(close(report));
    }
  };
}

/**
 * @param {InterventionReport} report
 */
export function close(report) {
  return dispatch => {
    dispatch({ type: INTERVENTION_REPORT_CLOSE });

    /** @type {Realm} */
    const realm = get('realm');

    realm.write(() => (report.closed = true));

    dispatch(updateLocalModificationCount());
  };
}

export function reset() {
  return dispatch => dispatch({ type: INTERVENTION_REPORT_RESET });
}
