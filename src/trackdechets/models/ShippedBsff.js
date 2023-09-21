/**
 * BSFF scanned during a shipping.
 */
class ShippedBsff {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String} number Readable ID on Trackdéchets
   *
   * @return {ShippedBsff}
   */
  static create(number) {
    const instance = new this();

    instance.number = number;

    return instance;
  }
}

ShippedBsff.schema = {
  name: 'ShippedBsff',
  properties: {
    number: 'string',
  },
};

export default ShippedBsff;
