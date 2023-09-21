import Usage from 'k2/app/modules/nomenclature/models/Usage';

/**
 * @property {String} purpose One of {@link Purpose} value
 */
class ArticleInterventionUnavailability {
  constructor() {
    // noop for realm
  }

  /**
   * Creates make the given purpose as unavailable for the given article
   *
   * @param {Article} article
   * @param {String} purpose
   * @param {Boolean} blocking
   * @param {Boolean} synced
   */
  static create(article, purpose, blocking, synced = true) {
    const instance = new this();

    instance.article = article;
    instance.purpose = purpose;
    instance.blocking = blocking;
    instance.synced = synced;

    return instance;
  }

  static createUnavailabilitiesForUsage(article, usage) {
    return Object.entries(Usage.UNAVAILABILITIES[usage] ?? []).map(([purpose, blocking]) =>
      ArticleInterventionUnavailability.create(article, purpose, blocking, false),
    );
  }
}

ArticleInterventionUnavailability.schema = {
  name: 'ArticleInterventionUnavailability',
  properties: {
    article: 'Article',
    purpose: 'string',
    blocking: 'bool',
    synced: 'bool',
  },
};

export default ArticleInterventionUnavailability;
