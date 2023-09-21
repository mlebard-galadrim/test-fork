import Circuit from './Circuit';

class Installation {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String}                       id
   * @param {String}                       reference
   * @param {String}                       barcode
   * @param {String}                       name
   * @param {Site}                         site
   * @param {InstallationTechnology|null}  technology
   * @param {InstallationApplication|null} application
   * @param {Date|null}                    commissioningDate
   * @param {Circuit[]}                    circuits
   * @param {Leak[]}                       leaks
   * @param {InstallationType}             type
   * @param {Boolean}                      synced
   * @param {Boolean}                      integratedLeakDetector
   * @param {Date|null}                    lastLeakDetectionDate
   * @param {Date|null}                    assemblyAt
   * @param {Date|null}                    disassemblyAt
   *
   * @return {Installation}
   */
  static create(
    id,
    reference,
    barcode,
    name,
    site,
    technology,
    application,
    commissioningDate,
    circuits = [],
    leaks = [],
    type = null,
    synced = false,
    integratedLeakDetector = false,
    lastLeakDetectionDate = null,
    assemblyAt = null,
    disassemblyAt = null,
    isDeleted = false,
  ) {
    const instance = new this();

    instance.id = id;
    instance.reference = reference;
    instance.barcode = barcode;
    instance.name = name;
    instance.site = site;
    instance.technology = technology;
    instance.application = application;
    instance.commissioningDate = commissioningDate;
    instance.circuits = circuits;
    instance.leaks = leaks;
    instance.type = type;
    instance.synced = synced;
    instance.integratedLeakDetector = integratedLeakDetector;
    instance.lastLeakDetectionDate = lastLeakDetectionDate;
    instance.assemblyAt = assemblyAt;
    instance.disassemblyAt = disassemblyAt;
    instance.isDeleted = isDeleted;

    return instance;
  }

  get client() {
    return this.site.client;
  }

  /**
   * Create a new circuit in this installation
   *
   * @param {Array} args Circuit.create arguments
   *
   * @return {Circuit}
   */
  createCircuit(...args) {
    const circuit = Circuit.create(this, this.circuits.length, ...args);

    this.circuits.push(circuit);
    this.synced = false;

    return circuit;
  }

  removeCircuit(circuit) {
    const index = this.circuits.indexOf(circuit);

    if (index !== -1) {
      this.circuits.splice(index, 1);
      this.synced = false;
    }

    return circuit;
  }

  isEmpty() {
    return this.primaryCircuit.isEmpty();
  }

  isFull() {
    return this.primaryCircuit.isFull();
  }

  isDismantled() {
    return Boolean(this.disassemblyAt);
  }

  /**
   * Primary circuit
   *
   * @return {Circuit|null}
   */
  get primaryCircuit() {
    if (this.circuits.length < 1) {
      return null;
    }

    return this.circuits[0];
  }

  /**
   * Secondary circuit
   *
   * @return {Circuit|null}
   */
  get secondaryCircuit() {
    if (this.circuits.length < 2) {
      return null;
    }

    return this.circuits[1];
  }

  /**
   * Does the installation has at least one leaking component?
   *
   * @return {Boolean}
   */
  get leaking() {
    return Array.from(this.leaks).filter(leak => !leak.repaired).length > 0;
  }

  /**
   * Add a declared leak on installation.
   *
   * @param {Leak} leak
   */
  addLeak(leak) {
    if (leak.repaired) {
      throw new Error('You are not supposed to add an already repaired leak on the installation.');
    }

    this.leaks.push(leak);
  }

  /**
   * Consider the leak as repaired by removing it from the installation.
   * The leak object is still "not repaired" until synced :
   * this is required so that the original leak detection keeps its state.
   *
   * @param {String} uuid Leak's uuid
   *
   * @return {Leak|null} the repaired leak or null if not found
   */
  removeLeakByUuid(uuid) {
    const index = this.leaks.findIndex(item => item.uuid === uuid);

    if (index === -1) {
      return null; // Leak does not exist!
    }

    return this.leaks.splice(index, 1)[0];
  }

  addAssemblyDate(date) {
    if (this.assemblyAt === null) {
      this.assemblyAt = date;
    }
  }

  addDisassemblyDate(date) {
    if (this.disassemblyAt === null) {
      this.disassemblyAt = date;
    }
  }

  addCommissioningDate(date) {
    if (this.commissioningDate === null) {
      this.commissioningDate = date;
    }
  }

  canOilBeAnalyzed() {
    const { oil, otherOilName } = this.primaryCircuit;
    return Boolean(oil || otherOilName);
  }
}

Installation.schema = {
  name: 'Installation',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: { type: 'string', optional: true }, // designation (to rename ?)
    reference: { type: 'string', optional: true }, // mark ("repère") (to rename ?)
    barcode: { type: 'string', optional: true },
    site: 'Site',
    circuits: { type: 'list', objectType: 'Circuit' },
    leaks: { type: 'list', objectType: 'Leak' },
    type: 'InstallationType',
    technology: 'InstallationTechnology',
    application: 'InstallationApplication',
    commissioningDate: { type: 'date', optional: true },
    synced: 'bool',
    integratedLeakDetector: 'bool',
    lastLeakDetectionDate: { type: 'date', optional: true },
    assemblyAt: { type: 'date', optional: true },
    disassemblyAt: { type: 'date', optional: true },
    isDeleted: 'bool',
  },
};

export default Installation;
