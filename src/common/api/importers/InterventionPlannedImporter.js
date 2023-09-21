import { get } from 'k2/app/container';
import AbstractImporter from 'k2/app/modules/common/api/importers/AbstractImporter';
import InterventionPlanned from '../../../intervention/models/InterventionPlanned';

/**
 * Import the Interventions
 */
class InterventionPlannedImporter extends AbstractImporter {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm);

    this.interventionRepository = get('intervention_planned_repository');

    this.load = this.load.bind(this);
    this.loadInterventionPlanned = this.loadInterventionPlanned.bind(this);
  }

  /**
   * Load interventions from API into the database
   *
   * @param {Array} data
   */
  load(data) {
    console.info('Loading planned interventions...');
    this.realm.write(() => {
      this.realm.delete(this.realm.objects(InterventionPlanned.schema.name));
      data.forEach(this.loadInterventionPlanned);
    });
    console.info('Planned interventions loaded!');
  }

  /**
   * Load a intervention from API
   *
   * @param {Object} data
   *
   * @return {InterventionPlanned}
   */
  loadInterventionPlanned(data) {
    const { uuid, type, purpose, installationUuid, plannedAt } = data;
    const object = InterventionPlanned.fromApi(uuid, installationUuid, type, purpose, plannedAt);
    return this.realm.create(InterventionPlanned.schema.name, object, true);
  }
}

export default InterventionPlannedImporter;
