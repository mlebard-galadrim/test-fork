import UUID from 'react-native-uuid';
import ContainerLoad from './ContainerLoad';
import Leak from './Leak';
import RepairedLeak from './RepairedLeak';
import Purpose from './Purpose';
import InterventionType from './InterventionType';
import InterventionReport from 'k2/app/modules/intervention_report/model/InterventionReport';
import CoolantContainer from './CoolantContainer';

/**
 * @property {String|null} reportUrl
 * @property {Date|null} performedAt Date entered by the user to replace the intervention creation date if needed.
 *                                   Only populated when creating the intervention.
 *                                   Removed once synced in favor of the creation date.
 */
class Intervention {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String|InterventionType} type
   * @param {String|null}             installation uuid
   * @param {String|null}             purpose
   * @param {Date|null}               performedAt
   *
   * @return {Intervention}
   */
  static create(type = null, installation = null, purpose = null, uuid = null, performedAt = null) {
    const instance = new this();

    instance.id = uuid ?? UUID.v4();
    instance.type = type instanceof InterventionType ? type.value : new InterventionType(type).value;
    instance.purpose =
      purpose ?? (instance.type === InterventionType.LEAK_REPAIR ? Purpose.CONTROL_NON_PERIODIC : null);
    instance.installation = installation;
    instance.containerLoads = [];
    instance.leaks = [];
    instance.repairedLeaks = [];
    instance.record = null;
    instance.observations = null;
    instance.operatorSignature = null;
    instance.clientSignature = null;
    instance.creation = new Date();
    instance.performedAt = performedAt;
    instance.saved = false;
    instance.synced = false;
    instance.updated = false;
    instance.detector = null;
    instance.markAsEmpty = false;
    instance.updateNominalLoad = false;
    instance.shouldCreateBsffFiche = false;
    instance.moveContainers = true;
    instance.moveContainersAsked = false;
    instance.fibsdUrl = null;
    instance.annexUrl = null;
    instance.reportUrl = null;
    instance.coolantContainers = [];

    return instance;
  }

  /**
   * Recursively clone the object
   *
   * @return {Intervention}
   */
  clone() {
    const instance = Object.assign(new Intervention(), this);

    instance.containerLoads = instance.containerLoads.map(load => load.clone());
    instance.leaks = instance.leaks.map(leak => leak.clone());

    return instance;
  }

  /**
   * @param {String} record
   */
  setRecord(record) {
    this.record = record;
  }

  /**
   * @param {String|Purpose} purpose
   */
  setPurpose(purpose = null) {
    if (purpose === null) {
      this.purpose = null;

      return;
    }

    if (purpose instanceof Purpose) {
      this.purpose = purpose.value;

      return;
    }

    this.purpose = new Purpose(purpose).value;
  }

  /**
   * @param {String} installation id
   */
  setInstallation(installation = null) {
    this.installation = installation;
  }

  get installationId() {
    return this.installation;
  }

  /**
   * @param {String} detector
   */
  setDetector(detector = null) {
    this.detector = detector;
  }

  /**
   * @param {String} reference The identifier of the container
   *
   * @return {ContainerLoad|null}
   */
  getContainerLoad(reference) {
    return this.containerLoads.find(load => reference === load.reference);
  }

  /**
   * @return {ContainerLoad}
   */
  getFirstContainerLoad() {
    if (!this.containerLoads.length) {
      return null;
    }

    return this.containerLoads[0];
  }

  /**
   * @return {ContainerLoad}
   */
  getLastContainerLoad() {
    if (!this.containerLoads.length) {
      return null;
    }

    return this.containerLoads[this.containerLoads.length - 1];
  }

  /**
   * @return {Number}
   */
  getTotalContainerLoad() {
    return this.containerLoads.reduce((total, container) => total + container.load, 0);
  }

  /**
   * @return {ContainerLoad}
   */
  addContainerLoad() {
    const containerLoad = ContainerLoad.create();

    this.containerLoads.push(containerLoad);

    return containerLoad;
  }

  /**
   * @param {String|null} reference The identifier of the container
   */
  removeContainerLoad(reference = null) {
    if (!reference) {
      this.containerLoads.pop();

      return;
    }

    const index = this.containerLoads.findIndex(load => reference === load.reference);

    if (index !== -1) {
      this.containerLoads.splice(index, 1);
    }
  }

  getLoadSum() {
    return this.containerLoads.reduce((current, containerLoad) => current + containerLoad.load, 0);
  }

  /**
   * @return {Boolean}
   */
  hasContainerLoads() {
    return this.containerLoads.length > 0;
  }

  /**
   * @return {Boolean}
   */
  hasRepairedLeaks() {
    return this.repairedLeaks.length > 0;
  }

  /**
   * Adds a new leak declaration
   *
   * @param {Number} index Index of the Leak
   * @param {String|null} componentUuid The component identifier. Null if not a component leak.
   * @param {String} location The description of the component location.
   * @param {Boolean} repaired Whether the leak is repaired yet or not.
   *
   * @return {Leak}
   */
  addLeak(componentUuid, location, repaired, index = this.leaks.length) {
    if (this.type !== InterventionType.LEAK && this.type !== InterventionType.LEAK_REPAIR) {
      throw new Error(
        'Can only add a leak declaration to a leak detection intervention.' +
          `Current intervention type is "${this.type}".`,
      );
    }

    if (index < 0 || index > this.leaks.length) {
      throw new Error(`Invalid index [${index} / ${this.leaks.length}]`);
    }

    const leak = Leak.create(componentUuid, location, repaired);

    this.leaks[index] = leak;

    return leak;
  }

  /**
   * Remove leak at the given index
   *
   * @param {Number} index
   */
  removeLeak(index = this.leaks.length - 1) {
    if (this.type !== InterventionType.LEAK) {
      throw new Error(
        'Can only remove a leak declaration to a leak detection intervention.' +
          `Current intervention type is "${this.type}".`,
      );
    }

    if (index < 0 || index >= this.leaks.length) {
      throw new Error(`Invalid index [${index} / ${this.leaks.length}]`);
    }

    this.leaks.splice(index, 1);
  }

  /**
   * @return {Boolean}
   */
  hasLeaks() {
    return this.leaks.length > 0;
  }

  /**
   * Set repaired leaks from uuids
   *
   * @param {Array} leakUuids
   */
  setRepairedLeak(leakUuids = []) {
    this.repairedLeaks = Array.from(new Set(leakUuids)).map(leakUuid => RepairedLeak.create(leakUuid));
  }

  /**
   * Is the last container load added empty?
   *
   * @return {Boolean}
   */
  isLastContainerLoadEmpty() {
    if (!this.hasContainerLoads()) {
      // No container in the intervention (first passage)
      return true;
    }

    return this.containerLoads[this.containerLoads.length - 1].isEmpty();
  }

  /**
   * Are all container loads valid?
   *
   * @return {Boolean}
   */
  areContainerLoadsValid() {
    if (!this.hasContainerLoads()) {
      return false;
    }

    return this.containerLoads.every(containerLoad => containerLoad.isValid());
  }

  /**
   * Set markAsEmpty
   *
   * @param {Boolean} markAsEmpty
   */
  setMarkAsEmpty(markAsEmpty) {
    this.markAsEmpty = markAsEmpty;
  }

  /**
   * Set updateNominalLoad
   *
   * @param {Boolean} updateNominalLoad
   */
  setUpdateNominalLoad(updateNominalLoad) {
    this.updateNominalLoad = updateNominalLoad;
  }

  /**
   * @param {Boolean} moveContainers
   */
  setMoveContainers(moveContainers) {
    this.moveContainers = moveContainers;
    this.moveContainersAsked = true;
  }

  /**
   * Set observations
   *
   * @param {String} observations
   */
  setObservations(observations) {
    this.observations = observations;
  }

  /**
   * @param {Date|null} performedAt
   */
  setPerformedAt(performedAt) {
    this.performedAt = performedAt;
  }

  /**
   * Set operator signature
   *
   * @param {Image} signature
   */
  setOperatorSignature(signature) {
    this.operatorSignature = signature;
  }

  setShouldCreateBsffFiche(shouldCreateBsffFiche) {
    this.shouldCreateBsffFiche = shouldCreateBsffFiche;
  }

  /**
   * Set client signature
   *
   * @param {Image} signature
   */
  setClientSignature(signature) {
    this.clientSignature = signature;
  }

  update() {
    if (this.synced) {
      this.updated = true;
    }
  }

  hasCoolantContainers() {
    return this.coolantContainers.length > 0;
  }

  addCoolantContainer() {
    const newCoolantContainer = CoolantContainer.create('', 0);

    this.coolantContainers = [...this.coolantContainers, newCoolantContainer];
    return newCoolantContainer;
  }

  removeCoolantContainer(index) {
    if (index > this.coolantContainers.length - 1) {
      return;
    }
    this.coolantContainers = this.coolantContainers.filter((c, idx) => {
      return idx !== index;
    });
  }

  updateCoolantContainer(index, field, value) {
    if (index > this.coolantContainers.length - 1) {
      return;
    }
    const newCoolantContainers = [...this.coolantContainers];
    newCoolantContainers[index][field] = value;
    this.coolantContainers = newCoolantContainers;
  }

  getCoolantContainerLoadSum() {
    return this.coolantContainers.reduce((current, coolantContainer) => current + coolantContainer.load, 0);
  }
}

Intervention.schema = {
  name: 'Intervention',
  primaryKey: 'id',
  properties: {
    id: 'string',
    type: 'string',
    purpose: 'string',
    installation: 'string',
    containerLoads: { type: 'list', objectType: 'ContainerLoad' },
    leaks: { type: 'list', objectType: 'Leak' },
    repairedLeaks: { type: 'list', objectType: 'RepairedLeak' },
    record: { type: 'string', optional: true },
    observations: { type: 'string', optional: true },
    operatorSignature: { type: 'string', optional: true },
    clientSignature: { type: 'string', optional: true },
    creation: 'date',
    performedAt: { type: 'date', optional: true },
    detector: { type: 'string', optional: true },
    coolantContainers: { type: 'list', objectType: 'CoolantContainer' },
    fibsdUrl: { type: 'string', optional: true },
    annexUrl: { type: 'string', optional: true },
    reportUrl: { type: 'string', optional: true },
    moveContainers: 'bool',
    markAsEmpty: 'bool',
    updateNominalLoad: 'bool',
    shouldCreateBsffFiche: { type: 'bool', default: false },
    synced: 'bool',
    /** Means that the object has been updated since the last sync. */
    updated: 'bool',

    /**
     * Whenever a report is ongoing for an intervention, this property is automatically set
     * @see https://realm.io/docs/javascript/latest/#inverse-relationships
     */
    onGoingReports: {
      type: 'linkingObjects',
      objectType: InterventionReport.schema.name,
      property: 'interventions',
    },
  },
};

export default Intervention;
