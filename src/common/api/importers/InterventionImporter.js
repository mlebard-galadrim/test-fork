import { get } from 'k2/app/container';
import Intervention from '../../../intervention/models/Intervention';
import ContainerLoad from '../../../intervention/models/ContainerLoad';
import Leak from '../../../intervention/models/Leak';
import AbstractImporter from 'k2/app/modules/common/api/importers/AbstractImporter';

/**
 * Import the Interventions
 */
class InterventionImporter extends AbstractImporter {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm);

    this.interventionRepository = get('intervention_repository');
    this.installationRepository = get('installation_repository');
    this.containerRepository = get('container_repository');

    this.load = this.load.bind(this);
    this.loadIntervention = this.loadIntervention.bind(this);
    this.loadContainer = this.loadContainer.bind(this);
    this.loadLeak = this.loadLeak.bind(this);
  }

  /**
   * Load interventions from API into the database
   *
   * @param {Array} data
   */
  load(data) {
    console.info('Loading interventions...');
    this.realm.write(() => {
      // Removing objects carefully to prevent dropping interventions foreign key
      // (e.g: unclosed interventions reports referencing a synced intervention):
      this.removeStaleObjects(this.interventionRepository, 'uuid', data);
      // Load interventions from API response:
      data.forEach(this.loadIntervention);
    });
    console.info('Interventions loaded!');
  }

  /**
   * Load an intervention from API
   *
   * @param {Object} data
   *
   * @return {Intervention}
   */
  loadIntervention(data) {
    const object = Object.assign(new Intervention(), {
      id: data.uuid,
      type: data.type,
      purpose: data.purpose,
      installation: data.installationUuid,
      record: data.record,
      observations: data.observations,
      operatorSignature: data.operatorSignature,
      clientSignature: data.clientSignature,
      creation: new Date(data.creation),
      performedAt: null,
      detector: data.detectorUuid,
      fibsdUrl: data.fibsdUrl,
      annexUrl: data.annexUrl,
      containerLoads: data.containerLoads.map(this.loadContainer),
      // At this point, all leaks (repaired or not) are in the same array:
      leaks: data.leaks.map(this.loadLeak),
      // We can empty the repaired leaks array:
      repairedLeaks: [],
      moveContainers: true,
      markAsEmpty: false,
      updateNominalLoad: false,
      saved: true,
      synced: true,
      updated: false,
      reportUrl: data.reportUrl,
      plannedAt: data.plannedAt,
    });

    return this.realm.create(Intervention.schema.name, object, true);
  }

  loadContainer(data) {
    const object = Object.assign(new ContainerLoad(), {
      containerUuid: data.containerUuid,
      barcode: data.barcode,
      fluid: data.fluidUuid,
      load: data.load,
      recycled: data.recycled,
      forElimination: data.forElimination,
      clientOwned: data.clientOwned,
    });

    return this.realm.create(ContainerLoad.schema.name, object, true);
  }

  loadLeak(data) {
    const object = Object.assign(new Leak(), {
      uuid: data.uuid,
      componentUuid: data.componentUuid,
      location: data.location,
      repaired: data.repaired,
    });

    return this.realm.create(Leak.schema.name, object, true);
  }
}

export default InterventionImporter;
