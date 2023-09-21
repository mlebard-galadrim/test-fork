/**
 * Represents a coolant container, which is separate from regular containers
 */
class CoolantContainer {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {string} type
   * @param {Number}               load
   */
  static create(type, load) {
    const instance = new this();

    instance.type = type;
    instance.load = load;

    return instance;
  }

  /**
   * Recursively clone the object
   *
   * @return {CoolantContainer}
   */
  clone() {
    return Object.assign(new CoolantContainer(), this);
  }
}

CoolantContainer.schema = {
  name: 'CoolantContainer',
  properties: {
    type: { type: 'string' },
    load: { type: 'int' },
  },
};

export default CoolantContainer;
