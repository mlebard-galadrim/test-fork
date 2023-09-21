/**
 * Detector
 */
class Detector {
  static VALIDITY = 1000 * 60 * 60 * 24 * 365; // 1 year

  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String}      id
   * @param {Client}      client
   * @param {String|null} designation
   * @param {String}      serialNumber
   * @param {String|null} barcode
   * @param {Date}        lastInspectionDate
   * @param {String|null} mark
   * @param {Boolean}     synced
   *
   * @return {Detector}
   */
  static create(
    id,
    client,
    designation = null,
    serialNumber,
    barcode = null,
    lastInspectionDate,
    mark = null,
    synced = false,
  ) {
    const instance = new this();

    instance.id = id;
    instance.client = client;
    instance.designation = designation;
    instance.serialNumber = serialNumber;
    instance.barcode = barcode;
    instance.lastInspectionDate = lastInspectionDate;
    instance.mark = mark;
    instance.synced = synced;

    return instance;
  }

  /**
   * @return {Boolean}
   */
  static hasExpired(date, now = new Date()) {
    return now.getTime() > date.getTime() + Detector.VALIDITY;
  }

  /**
   * @return {Date}
   */
  get expiresAt() {
    const lastInspectionDate = new Date(this.lastInspectionDate);

    lastInspectionDate.setMilliseconds(lastInspectionDate.getMilliseconds() + Detector.VALIDITY);

    return lastInspectionDate;
  }

  /**
   * Check if detector has expired
   *
   * @return {Boolean}
   */
  get expired() {
    return Detector.hasExpired(this.lastInspectionDate);
  }

  /**
   * Recursively clone the object
   *
   * @return {Detector}
   */
  clone() {
    return Object.assign(new Detector(), this);
  }
}

Detector.schema = {
  name: 'Detector',
  primaryKey: 'id',
  properties: {
    id: 'string',
    client: 'Client',
    designation: { type: 'string', optional: true },
    serialNumber: 'string',
    barcode: { type: 'string', optional: true },
    lastInspectionDate: 'date',
    mark: { type: 'string', optional: true },
    synced: 'bool',
  },
};

export default Detector;
