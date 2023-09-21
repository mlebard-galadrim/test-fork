/**
 * BSDD scanned during a shipping.
 */
class ShippedBsdd {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String} number "N° bordereau" / ID on Trackdéchets
   *
   * @return {ShippedBsff}
   */
  static create(number) {
    const instance = new this();

    instance.number = number;

    return instance;
  }
}

ShippedBsdd.schema = {
  name: 'ShippedBsdd',
  properties: {
    number: 'string',
  },
};

export default ShippedBsdd;
