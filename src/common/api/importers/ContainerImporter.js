import { get } from 'k2/app/container';
import Container from '../../../container/models/Container';
import AbstractImporter from 'k2/app/modules/common/api/importers/AbstractImporter';

/**
 * Import the Containers
 */
class ContainerImporter extends AbstractImporter {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm);

    this.articleRepository = get('article_repository');
    this.fluidRepository = get('fluid_repository');
    this.competitorRepository = get('competitor_repository');
    this.siteRepository = get('site_repository');

    this.load = this.load.bind(this);
    this.loadContainer = this.loadContainer.bind(this);
    this.removeContainer = this.removeContainer.bind(this);
    this.removeContainerByUuid = this.removeContainerByUuid.bind(this);
  }

  /**
   * Load containers from API into the database
   *
   * @param {Array} containers
   * @param {String[]} removedContainerUuids
   * @param {Boolean} removeAll
   * @param {Number} sliceNb N° of the current slice being imported
   */
  load(containers, removedContainerUuids = [], removeAll = true, sliceNb) {
    console.info(`Loading slice N°${sliceNb} with ${containers.length} containers...`);

    this.realm.write(() => {
      if (removeAll && sliceNb === 1) {
        // By default, a full sync will retrieve all containers,
        // so we remove all to recreate these:
        console.info('Removing all containers from local database…');
        this.realm.delete(this.realm.objects(Container.schema.name));
        // This is only executed on the first slice, since we do only need to clear the DB once
      } else {
        // Otherwise, just delete the containers received, so we can recreate these from up-to-date data:
        containers.forEach(this.removeContainer);
        // + the containers explicitly hardly removed in between indicated by the API:
        removedContainerUuids.forEach(this.removeContainerByUuid);
      }

      // Load containers from data
      containers.forEach(this.loadContainer);
    });

    console.info(`${containers.length} containers loaded!`);
  }

  /**
   * Load a container from API
   *
   * @param {Object} data
   *
   * @return {Container}
   */
  loadContainer(data) {
    const {
      uuid,
      barcode,
      currentLoad,
      articleUuid,
      currentFluidUuids,
      competitorUuid,
      lastInterventionInfo,
      lastShippingType,
      lastPosition,
      unknown,
      toReset,
      updatedAt,
      archived,
    } = data;

    const object = Container.fromApi(
      uuid,
      barcode,
      this.articleRepository.find(articleUuid),
      currentFluidUuids.map(this.fluidRepository.find),
      currentLoad,
      lastInterventionInfo ? lastInterventionInfo.type : null,
      lastInterventionInfo ? lastInterventionInfo.purpose : null,
      lastShippingType,
      lastPosition ? this.siteRepository.find(lastPosition) : null,
      competitorUuid ? this.competitorRepository.find(competitorUuid) : null,
      unknown,
      toReset,
      new Date(updatedAt),
      archived,
    );

    return this.realm.create(Container.schema.name, object, true);
  }

  removeContainer(data) {
    const { uuid } = data;

    this.removeContainerByUuid(uuid);
  }

  removeContainerByUuid(uuid) {
    const container = this.realm.objectForPrimaryKey(Container.schema.name, uuid);
    if (!container) {
      // Container not found, skip
      return;
    }

    this.realm.delete(container);
  }
}

export default ContainerImporter;
