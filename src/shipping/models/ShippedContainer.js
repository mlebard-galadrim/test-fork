/**
 * @property {String} id
 * @property {?Number} arianeOperationLineNumber
 */
class ShippedContainer {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String} id
   * @param {?Number} arianeOperationLineNumber
   *
   * @return {ShippedContainer}
   */
  static create(id, arianeOperationLineNumber) {
    const instance = new this();

    instance.id = id;
    instance.arianeOperationLineNumber = arianeOperationLineNumber;

    return instance;
  }
}

ShippedContainer.schema = {
  name: 'ShippedContainer',
  properties: {
    id: 'string',
    arianeOperationLineNumber: 'int?',
  },
};

export default ShippedContainer;
