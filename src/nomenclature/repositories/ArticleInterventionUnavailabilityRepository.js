import AbstractRepository from '../../common/repositories/AbstractRepository';
import ArticleInterventionUnavailability from '../models/ArticleInterventionUnavailability';
import Purpose from 'k2/app/modules/intervention/models/Purpose';
import Usage from 'k2/app/modules/nomenclature/models/Usage';

export default class ArticleInterventionUnavailabilityRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, ArticleInterventionUnavailability.schema);
  }

  getUnavailability(articleUuid, purpose) {
    const result = this.realm
      .objects(this.schema.name)
      .filtered('article.uuid == $0 && purpose == $1', articleUuid, purpose)
      .sorted('blocking', true);

    return result.length ? result[0] : null;
  }

  /**
   * @param {String} articleUuid
   *
   * @returns {Realm.Results<Realm.Object>|ArticleInterventionUnavailability[]}
   */
  getUnavailabilities(articleUuid) {
    return this.realm.objects(this.schema.name).filtered('article.uuid == $0', articleUuid);
  }

  /**
   * @param {String} articleUuid
   *
   * @returns {Boolean}
   */
  isNotAvailableForInterventions(articleUuid) {
    const unavailabilities = this.getUnavailabilities(articleUuid);
    const interventionAvailabilities = Purpose.getArticleAvailabilityPurposesValues();

    const purposes = [
      ...new Set(
        unavailabilities
          .map(unavailability => unavailability.purpose)
          .filter(unavailability => interventionAvailabilities.includes(unavailability)),
      ),
    ];

    return purposes.length >= interventionAvailabilities.length;
  }

  /**
   * Is a recup or transfer Article in terms of usage. Actually means it's not a filling article in terms of usage.
   *
   * @see Usage
   */
  isAvailableForRecupOrTransfer(articleUuid) {
    return !this.isFillingArticle(articleUuid);
  }

  /**
   * Is a filling usage article.
   */
  isFillingArticle(articleUuid) {
    const fillingUnavailabilities = Object.keys(Usage.UNAVAILABILITIES[Usage.FILLING]);

    // If every of the FILLING unavailabilities exist,
    // then the article is not available for recup or transfer but for filling:
    return fillingUnavailabilities.map(purpose => this.getUnavailability(articleUuid, purpose)).every(Boolean);
  }

  clearForArticle(articleUuid) {
    const unavailabilities = this.getUnavailabilities(articleUuid);

    this.delete(unavailabilities);
  }
}
