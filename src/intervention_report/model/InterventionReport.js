import UUID from 'react-native-uuid';

/**
 * Gather intervention of the day for a site to generate a report.
 *
 * @property {String} uuid
 * @property {Site} site
 * @property {Date} date
 * @property {String|null} reportNumber
 * @property {Intervention[]} interventions
 * @property {Date|null} roundTripGoStartDate
 * @property {Date|null} roundTripGoEndDate
 * @property {Number|null} roundTripGoDistance
 * @property {Date|null} roundTripReturnStartDate
 * @property {Date|null} roundTripReturnEndDate
 * @property {Number|null} roundTripReturnDistance
 * @property {Date|null} startDate
 * @property {Date|null} endDate
 * @property {Site|null} billingSite
 * @property {String|null} comment
 * @property {String} operatorSignature
 * @property {String|null} clientSignature
 * @property {Date} createdAt
 * @property {Boolean} synced
 * @property {Boolean} closed
 */
class InterventionReport {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {Site} site
   * @param {Date} date
   * @param {String|null} reportNumber
   * @param {Intervention[]} interventions
   * @param {Date|null} roundTripGoStartDate
   * @param {Date|null} roundTripGoEndDate
   * @param {Number|null} roundTripGoDistance
   * @param {Date|null} roundTripReturnStartDate
   * @param {Date|null} roundTripReturnEndDate
   * @param {Number|null} roundTripReturnDistance
   * @param {Date|null} startDate
   * @param {Date|null} endDate
   * @param {Site|null} billingSite
   * @param {String|null} comment
   * @param {String} operatorSignature
   * @param {String|null} clientSignature
   *
   * @return {Transfer}
   */
  static create(
    site,
    date,
    reportNumber = null,
    interventions = [],
    roundTripGoStartDate = null,
    roundTripGoEndDate = null,
    roundTripGoDistance = null,
    roundTripReturnStartDate = null,
    roundTripReturnEndDate = null,
    roundTripReturnDistance = null,
    startDate = null,
    endDate = null,
    billingSite = null,
    comment = null,
    operatorSignature,
    clientSignature = null,
  ) {
    const instance = new this();

    instance.uuid = UUID.v4();

    instance.site = site;
    instance.date = date;
    instance.reportNumber = reportNumber;
    instance.interventions = interventions;
    instance.roundTripGoStartDate = roundTripGoStartDate;
    instance.roundTripGoEndDate = roundTripGoEndDate;
    instance.roundTripGoDistance = roundTripGoDistance;
    instance.roundTripReturnStartDate = roundTripReturnStartDate;
    instance.roundTripReturnEndDate = roundTripReturnEndDate;
    instance.roundTripReturnDistance = roundTripReturnDistance;
    instance.startDate = startDate;
    instance.endDate = endDate;
    instance.billingSite = billingSite;
    instance.comment = comment;
    instance.operatorSignature = operatorSignature;
    instance.clientSignature = clientSignature;

    instance.createdAt = new Date();
    instance.closed = false;
    instance.synced = false;

    return instance;
  }

  /**
   * Update the report date whenever changing the interventions, so the report date is always after the interventions
   * date, hence interventions are always created first on API side.
   */
  updateCreatedAt() {
    this.createdAt = new Date();
  }

  /**
   * Close the report to be available to sync, so it'll be generated as a PDF by the API.
   * Once closed, the report cannot be modified.
   */
  close() {
    this.closed = true;
  }
}

InterventionReport.schema = {
  name: 'InterventionReport',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    reportNumber: 'string?',
    site: 'Site',
    date: 'date',
    interventions: { type: 'list', objectType: 'Intervention' },
    roundTripGoStartDate: 'date?',
    roundTripGoEndDate: 'date?',
    roundTripGoDistance: 'double?',
    roundTripReturnStartDate: 'date?',
    roundTripReturnEndDate: 'date?',
    roundTripReturnDistance: 'double?',
    startDate: 'date?',
    endDate: 'date?',
    billingSite: { type: 'Site', optional: true },
    comment: 'string?',
    operatorSignature: 'string',
    clientSignature: 'string?',
    createdAt: 'date',
    synced: 'bool',
    closed: { type: 'bool', default: false },
  },
};

export default InterventionReport;
