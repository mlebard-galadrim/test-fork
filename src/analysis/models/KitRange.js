/**
 * @property {String} start
 * @property {String} end
 */
class KitRange {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   *
   * @param {String} start
   * @param {String} end
   */
  static fromApi(start, end) {
    const instance = new this();

    instance.start = start;
    instance.end = end;

    return instance;
  }
}

KitRange.schema = {
  name: 'KitRange',
  properties: {
    start: 'string',
    end: 'string',
  },
};

export default KitRange;
