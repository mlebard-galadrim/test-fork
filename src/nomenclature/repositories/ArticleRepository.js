import AbstractRepository from '../../common/repositories/AbstractRepository';
import Article from '../models/Article';
import ArticleInterventionUnavailability from '../models/ArticleInterventionUnavailability';

export default class ArticleRepository extends AbstractRepository {
  constructor(realm, unavailabilityRepository) {
    super(realm, Article.schema);

    this.unavailabilityRepository = unavailabilityRepository;
  }

  findAll() {
    return super.findAll().sorted('designation');
  }

  findByFluidAndCompetitor(fluid = null, competitor = null) {
    return this.findAll()
      .filtered('belongsToMyCompany == true')
      .filtered(fluid ? 'fluid.uuid == $0' : 'fluid == null', fluid?.uuid ?? undefined)
      .filtered(competitor ? 'competitor.uuid == $0' : 'competitor == null', competitor?.uuid ?? undefined);
  }

  findByFluidOrEmptyAndCompetitor(fluid = null, competitor = null) {
    return this.findAll()
      .filtered('belongsToMyCompany == true')
      .filtered(fluid ? '(fluid.uuid == $0 OR fluid == null)' : 'fluid == null', fluid?.uuid ?? undefined)
      .filtered(competitor ? 'competitor.uuid == $0' : 'competitor == null', competitor?.uuid ?? undefined);
  }

  findByUniqueCriteria(fluid, quantity, volume, competitor) {
    const results = this.findByFluidAndCompetitor(fluid, competitor).filtered(
      'quantity == $0 AND volume == $1',
      quantity,
      volume,
    );

    if (results.length) {
      return results[0];
    }

    return null;
  }

  create(designation, fluid, quantity, volume, pressure, competitor, usage) {
    const article = this.save(Article.createUnknown(designation, fluid, quantity, volume, pressure, competitor));
    const unavailabilities = ArticleInterventionUnavailability.createUnavailabilitiesForUsage(article, usage);

    unavailabilities.forEach(this.unavailabilityRepository.save);

    return article;
  }

  /**
   * Updates an article and its usages (from user's input when updating a container).
   */
  update(article, pression, usage) {
    // Clear previous usages:
    this.unavailabilityRepository.clearForArticle(article.uuid);
    // Update article fields:
    article.update(pression);
    // Re-create unavailabilities for new usage:
    const unavailabilities = ArticleInterventionUnavailability.createUnavailabilitiesForUsage(article, usage);

    unavailabilities.forEach(this.unavailabilityRepository.save);
  }

  /**
   * @param {String} externalId
   *
   * @returns {Article|null}
   */
  findInMyHierarchyByExternalId(externalId) {
    const results = this.findAll().filtered('belongsToMyCompany == true').filtered('externalId == $0', externalId);

    return results.length ? results[0] : null;
  }
}
