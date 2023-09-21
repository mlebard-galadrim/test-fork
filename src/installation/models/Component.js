class Component {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String}                              uuid
   * @param {Circuit}                             circuit
   * @param {ComponentNature}                     nature
   * @param {String|null}                         designation
   * @param {String|null}                         mark
   * @param {String|null}                         barcode
   * @param {ComponentNatureClassification|null}  natureClassification
   * @param {ComponentNatureType|null}            natureType
   * @param {Date|null}                           commissioningDate
   * @param {ComponentBrand|null}                 brand
   * @param {String|null}                         brandOther
   * @param {String|null}                         model
   * @param {Number|null}                         serialNumber
   * @param {Number|null}                         usagePercent
   *
   * @return {Component}
   */
  static create(
    uuid,
    circuit,
    nature,
    designation = null,
    mark = null,
    barcode = null,
    natureClassification = null,
    natureType = null,
    commissioningDate = null,
    brand = null,
    brandOther = null,
    model = null,
    serialNumber = null,
    usagePercent = null,
    synced = false,
  ) {
    const instance = new this();

    instance.uuid = uuid;
    instance.circuit = circuit;
    instance.nature = nature;
    instance.designation = designation;
    instance.mark = mark;
    instance.barcode = barcode;
    instance.natureClassification = natureClassification;
    instance.natureType = natureType;
    instance.commissioningDate = commissioningDate;
    instance.brand = brand;
    instance.brandOther = brandOther;
    instance.model = model;
    instance.serialNumber = serialNumber;
    instance.usagePercent = usagePercent;
    instance.synced = synced;

    return instance;
  }

  /**
   * Is component leaking?
   * Based on installation leaks, but accepts "pending" leaks as parameter for leak detection.
   *
   * @param {Array} leaks
   *
   * @return {Boolean}
   */
  isLeaking(leaks = []) {
    return Array.from(this.circuit.installation.leaks)
      .concat(leaks)
      .some(leak => leak.componentUuid === this.uuid && !leak.repaired);
  }

  isCompressor() {
    return this.nature.uuid === '1';
  }
}

Component.schema = {
  name: 'Component',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    circuit: 'Circuit',
    nature: 'ComponentNature',
    designation: { type: 'string', optional: true },
    mark: { type: 'string', optional: true },
    barcode: { type: 'string', optional: true },
    natureClassification: {
      type: 'ComponentNatureClassification',
      optional: true,
    },
    natureType: { type: 'ComponentNatureType', optional: true },
    commissioningDate: { type: 'date', optional: true },
    brand: { type: 'ComponentBrand', optional: true },
    brandOther: { type: 'string', optional: true },
    model: { type: 'string', optional: true },
    serialNumber: { type: 'string', optional: true },
    usagePercent: { type: 'double', optional: true },
    synced: 'bool',
  },
};

export default Component;
