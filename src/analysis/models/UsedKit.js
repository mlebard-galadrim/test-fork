/**
 * @property {String} barcode
 */
class UsedKit {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   *
   * @param {String} barcode
   */
  static fromApi(barcode) {
    return this.createUsedKit(barcode);
  }

  /**
   *
   * @param {String} barcode
   */
  static createUsedKit(barcode) {
    const instance = new this();

    instance.barcode = barcode;

    return instance;
  }
}

UsedKit.schema = {
  name: 'UsedKit',
  primaryKey: 'barcode',
  properties: {
    barcode: 'string',
  },
};

export default UsedKit;
