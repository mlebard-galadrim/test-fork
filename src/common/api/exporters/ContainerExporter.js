import { get } from 'k2/app/container';

export default class ContainerExporter {
  constructor() {
    this.articleRepository = get('article_repository');
    this.unavailabilityRepository = get('unavailability_repository');
    this.containerRepository = get('container_repository');

    this.getRaw = this.getRaw.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.clearUnSafeData = this.clearUnSafeData.bind(this);
    this.transformArticleToResource = this.transformArticleToResource.bind(this);
    this.transformUnavailabilityToResource = this.transformUnavailabilityToResource.bind(this);
    this.transformContainerToResource = this.transformContainerToResource.bind(this);
    this.transformToCreateCommand = this.transformToCreateCommand.bind(this);
    this.transformToUpdateCommand = this.transformToUpdateCommand.bind(this);
    this.finishExport = this.finishExport.bind(this);
  }

  getRaw() {
    const created = this.containerRepository.findUnsynced();
    const updated = this.containerRepository.findUpdated();

    return { created, updated };
  }

  retrieve() {
    const { created, updated } = this.getRaw();

    return created.map(this.transformToCreateCommand).concat(updated.map(this.transformToUpdateCommand));
  }

  clearUnSafeData() {
    const { created, updated } = this.getRaw();
    const containers = Array.from(created).concat(Array.from(updated));
    const articles = containers.map(container => container.article).filter(Boolean);

    articles.forEach(article => this.unavailabilityRepository.clearForArticle(article.uuid));
    articles.forEach(article => this.articleRepository.delete(article));
    containers.forEach(container => this.containerRepository.delete(container));
  }

  transformToCreateCommand(container) {
    return {
      type: 'container_create',
      data: this.transformContainerToResource(container),
    };
  }

  transformToUpdateCommand(container) {
    return {
      type: 'container_update',
      data: this.transformContainerToResource(container),
      updatedAt: container.localUpdatedAt.toISOString(),
    };
  }

  /**
   * @param {Container} container
   *
   * @return {Object}
   */
  transformContainerToResource(container) {
    const { id, barcode, initialLoad, article, competitor } = container;

    return {
      uuid: id,
      barcode,
      /*
       * Whenever we are creating or updating the container,
       * the initial load is sent rather than the current load,
       * since it represents the load of the container before applying any intervention load diff.
       * These diffs will be applied by the API on intervention creation.
       */
      currentLoad: initialLoad,
      competitorUuid: competitor?.uuid ?? null,
      article: this.transformArticleToResource(article),
      // No need to provide the fluid if there is already one in the article:
      fluidUuid: article.fluid ? null : container.fluid?.uuid,
    };
  }

  /**
   * @param {Article} article
   *
   * @return {Object}
   */
  transformArticleToResource(article) {
    const { uuid, fluid, designation, quantity, volume, pressure, competitor } = article;

    return {
      uuid,
      designation,
      competitorUuid: competitor?.uuid ?? null,
      fluidUuid: fluid?.uuid ?? null,
      quantity,
      volume,
      pressure,
      unavailabilities: Array.from(
        this.unavailabilityRepository.getUnavailabilities(article.uuid).map(this.transformUnavailabilityToResource),
      ),
    };
  }

  /**
   * @param {ArticleInterventionUnavailability} unavailability
   *
   * @return {Object}
   */
  transformUnavailabilityToResource(unavailability) {
    const { purpose, blocking } = unavailability;

    return {
      purpose,
      blocking,
    };
  }

  finishExport() {
    this.containerRepository.markAllAsSynced();
  }
}
