/**
 * Represents loaded/unloaded value from a container during an intervention.
 * Load value is absolute. The intervention type determines whether it's a load or an unload.
 */
class ContainerLoad {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @return {ContainerLoad}
   */
  static create() {
    const instance = new this();

    instance.reset();

    return instance;
  }

  /**
   * Is containerLoad loaded and valid?
   *
   * @return {Boolean}
   */
  isValid() {
    return this.load > 0;
  }

  /**
   * Is containerLoad empty?
   *
   * @return {Boolean}
   */
  isEmpty() {
    return this.containerUuid.length === 0 && this.barcode.length === 0;
  }

  /**
   * Reset containerLoad
   */
  reset() {
    this.containerUuid = '';
    this.barcode = '';
    this.fluid = null;
    this.load = 0;
    this.recycled = null;
    this.forElimination = null;
    this.clientOwned = null;
  }

  /**
   * Recursively clone the object
   *
   * @return {ContainerLoad}
   */
  clone() {
    return Object.assign(new ContainerLoad(), this);
  }
}

ContainerLoad.schema = {
  name: 'ContainerLoad',
  properties: {
    containerUuid: 'string',
    barcode: 'string',
    fluid: { type: 'string', optional: true },
    load: 'double',
    recycled: { type: 'bool', optional: true },
    forElimination: { type: 'bool', optional: true },
    clientOwned: { type: 'bool', optional: true },
  },
};

export default ContainerLoad;
