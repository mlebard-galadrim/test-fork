/**
 * An Ariane operation for shippings with documents
 *
 * @property {String} type
 * @property {Number} companyNumber
 * @property {Number} number
 */
class ArianeOperation {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String} type
   * @param {Number} companyNumber
   * @param {Number} number
   *
   * @return {ArianeOperation}
   */
  static create(type, companyNumber, number) {
    const instance = new this();

    instance.type = type;
    instance.companyNumber = companyNumber;
    instance.number = number;

    return instance;
  }
}

ArianeOperation.schema = {
  name: 'ArianeOperation',
  properties: {
    type: 'string',
    companyNumber: 'int',
    number: 'int',
  },
};

export default ArianeOperation;
