class Circuit {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {Installation} installation
   * @param {Component[]}  components
   * @param {Number}       index
   * @param {Fluid}        fluid
   * @param {Number}       currentLoad
   * @param {Number}       nominalLoad
   * @param {Oil}          oil
   * @param {Number}       oilQuantity
   * @param {Coolant}      coolant
   * @param {Number}       coolantQuantity
   * @param {String|null}  pressure
   *
   * @return {Circuit}
   */
  static create(
    installation,
    index,
    fluid,
    oil,
    coolant,
    currentLoad = 0,
    nominalLoad = 0,
    oilQuantity = 0,
    coolantQuantity = 0,
    coolantLevelPercent = 0,
    otherCoolantName = null,
    components = [],
    pressure = null,
    antacid = false,
    otherOilName = null,
  ) {
    const instance = new this();

    instance.id = `${installation.id}-${index}`;
    instance.installation = installation;
    instance.index = parseInt(index, 10);
    instance.fluid = fluid;
    instance.currentLoad = currentLoad;
    instance.nominalLoad = nominalLoad;
    instance.oil = oil;
    instance.oilQuantity = oilQuantity;
    instance.coolant = coolant;
    instance.coolantQuantity = coolantQuantity;
    instance.coolantLevelPercent = coolantLevelPercent;
    instance.otherCoolantName = otherCoolantName;
    instance.components = components;
    instance.pressure = pressure;
    instance.antacid = antacid;
    instance.otherOilName = otherOilName;

    return instance;
  }

  isEqual(circuit = null) {
    if (!circuit) {
      return false;
    }

    return circuit.id === this.id;
  }

  isPrimary() {
    return this.index === 0;
  }

  isEmpty() {
    return this.currentLoad <= 0;
  }

  isFull() {
    return this.nominalLoad && this.currentLoad === this.nominalLoad;
  }

  setCurrentLoad(load, updateNominalLoad = false) {
    this.currentLoad = Math.max(load, 0);

    if (updateNominalLoad) {
      this.nominalLoad = Math.max(this.currentLoad, this.nominalLoad);
    }
  }

  setFluid(fluid) {
    this.fluid = fluid;
  }

  fill(load, updateNominalLoad = false) {
    this.setCurrentLoad(this.currentLoad + load, updateNominalLoad);
  }

  drain(load) {
    this.setCurrentLoad(this.currentLoad - load);
  }

  setCurrentCoolantLoad(load) {
    this.coolantQuantity = Math.max(load, 0);
  }

  drainCoolant(load) {
    this.setCurrentCoolantLoad(this.coolantQuantity - load);
  }

  empty() {
    this.setCurrentLoad(0);
  }

  hasCompressor() {
    return this.components.some(c => c.isCompressor());
  }
}

Circuit.schema = {
  name: 'Circuit',
  primaryKey: 'id',
  properties: {
    id: 'string',
    installation: 'Installation',
    index: 'int',
    components: { type: 'list', objectType: 'Component' },
    fluid: 'Fluid',
    currentLoad: 'double',
    nominalLoad: 'double',
    oil: 'Oil',
    oilQuantity: 'double',
    coolant: 'Coolant',
    coolantQuantity: 'double',
    coolantLevelPercent: 'double',
    otherCoolantName: { type: 'string', optional: true },
    pressure: { type: 'string', optional: true },
    antacid: { type: 'bool', default: false },
    otherOilName: { type: 'string', optional: true },
  },
};

export default Circuit;
