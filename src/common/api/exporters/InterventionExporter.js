import { get } from 'k2/app/container';
import InterventionType from 'k2/app/modules/intervention/models/InterventionType';

class InterventionExporter {
  constructor() {
    this.interventionRepository = get('intervention_repository');

    this.getRaw = this.getRaw.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.clearUnSafeData = this.clearUnSafeData.bind(this);
    this.transformInterventionToResource = this.transformInterventionToResource.bind(this);
    this.transformLeakToResource = this.transformLeakToResource.bind(this);
    this.transformRepairedLeakToResource = this.transformRepairedLeakToResource.bind(this);
    this.transformContainerLoadToResource = this.transformContainerLoadToResource.bind(this);
    this.finishExport = this.finishExport.bind(this);
  }

  getRaw() {
    const unsynced = this.interventionRepository.findUnsynced();
    const updated = this.interventionRepository.findUpdated();

    return { unsynced, updated };
  }

  retrieve() {
    const { unsynced, updated } = this.getRaw();

    return unsynced
      .map(this.transformInterventionToResource)
      .concat(updated.map(this.transformInterventionToSignResource));
  }

  clearUnSafeData() {
    const { unsynced, updated } = this.getRaw();

    [].concat(unsynced, updated).forEach(intervention => this.interventionRepository.delete(intervention));
  }

  /**
   * @param {Intervention} intervention
   *
   * @return {{type: String, data: Object}}
   */
  transformInterventionToResource(intervention) {
    const {
      id,
      type,
      purpose,
      installation,
      containerLoads,
      leaks,
      repairedLeaks,
      record,
      observations,
      operatorSignature,
      clientSignature,
      creation,
      performedAt,
      detector,
      moveContainers,
      markAsEmpty,
      updateNominalLoad,
      shouldCreateBsffFiche,
      coolantContainers,
    } = intervention;

    return {
      type: 'intervention',
      data: {
        id,
        type,
        purpose,
        installation,
        containerLoads: Array.from(containerLoads).map(this.transformContainerLoadToResource),
        leaks: type === InterventionType.LEAK ? Array.from(leaks).map(this.transformLeakToResource) : [],
        repairedLeaks:
          type === InterventionType.LEAK_REPAIR
            ? Array.from(repairedLeaks).map(this.transformRepairedLeakToResource)
            : [],
        record,
        observations,
        operatorSignature,
        clientSignature,
        creation: creation.toISOString(),
        performedAt: performedAt?.toISOString() ?? null,
        detector,
        moveContainers,
        markAsEmpty,
        updateNominalLoad,
        shouldCreateBsffFiche,
        coolantContainers,
      },
    };
  }

  /**
   * @param {Leak} leak
   */
  transformLeakToResource(leak) {
    const { uuid, componentUuid, location, repaired } = leak;

    return {
      uuid,
      component: componentUuid,
      location,
      repaired,
    };
  }

  /**
   * @param {RepairedLeak} repairedLeak
   *
   * @return {String} Leak uuid
   */
  transformRepairedLeakToResource(repairedLeak) {
    return repairedLeak.leakUuid;
  }

  /**
   * @param {ContainerLoad} containerLoad
   */
  transformContainerLoadToResource(containerLoad) {
    const { containerUuid, barcode, fluid, load, recycled, forElimination, clientOwned } = containerLoad;

    return {
      containerUuid,
      barcode,
      fluid,
      load,
      recycled,
      forElimination,
      clientOwned,
    };
  }

  /**
   * @param {Intervention} intervention
   *
   * @return {{type: String, data: Object}}
   */
  transformInterventionToSignResource(intervention) {
    const { id, operatorSignature, clientSignature } = intervention;

    return {
      type: 'intervention_sign',
      data: {
        id,
        operatorSignature,
        clientSignature,
      },
    };
  }

  finishExport() {
    this.interventionRepository.markAllAsSynced();
  }
}

export default InterventionExporter;
