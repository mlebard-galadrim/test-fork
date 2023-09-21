import AbstractRepository from 'k2/app/modules/common/repositories/AbstractRepository';
import Container from '../models/Container';

export default class ContainerRepository extends AbstractRepository {
  /**
   * {@inheritDoc}
   */
  constructor(realm) {
    super(realm, Container.schema);
  }

  /**
   * @param {String} barcode
   * @param {Boolean} asQuery
   *
   * @return {Container[]|Realm.Results<Container>}
   */
  search(barcode, asQuery = false) {
    const query = this.filteredByMostRecentPerBarcodeAndCompetitor(this.findByBarcode(barcode));

    return asQuery ? query : Array.from(query);
  }

  /**
   * @param {String} barcode
   *
   * @return {Realm.Results<Container>}
   */
  findByBarcode(barcode) {
    return this.realm
      .objects(this.schema.name)
      .filtered('archived == $0', false)
      .filtered('barcode ==[c] $0', barcode.trim());
  }

  /**
   * Whether a known or unknown container exists for the barcode, but with no competitor (Climalife)
   *
   * @return {Boolean}
   */
  hasClimalifeContainerForBarcode(barcode) {
    const results = this.findByBarcode(barcode).filtered('competitor == $0', null).filtered('archived == $0', false);
    return results.length > 0;
  }

  /**
   * Update or create unknown container
   *
   * @param  {String} barcode
   * @param  {Article} article
   * @param  {Fluid|null} fluid
   * @param  {Number} load
   * @param  {Competitor|null} competitor
   *
   * @return {Container}
   */
  updateOrCreate(barcode, article, fluid, load, competitor) {
    let containers = this.findAll().filtered(
      'article.uuid == $0 AND competitor.uuid == $1 AND barcode == $2',
      article ? article.uuid : null,
      competitor ? competitor.uuid : null,
      barcode,
    );

    containers = this.filteredByMostRecentPerBarcodeAndCompetitor(containers);

    // We don't filter for archived containers here, the API will re-enable it if needed.
    // It might happen when trying to create a container with same criteria as an existing archived one.

    // Result found, update and return:
    if (containers.length) {
      const container = containers[0];

      container.updateUnknown(article, fluid, load);

      return container;
    }

    // No result, create a new one:
    return this.save(Container.createUnknown(barcode, article, fluid, load, competitor));
  }

  /**
   * @return {Object[]}
   */
  findUpdated() {
    return this.getTable().filtered('localUpdatedAt != $0', null);
  }

  markAllAsSynced() {
    this.realm.write(() => {
      Array.from(this.findUnsynced()).forEach(c => {
        c.synced = true;
      });
      Array.from(this.findUpdated()).forEach(c => {
        c.localUpdatedAt = null;
      });
    });
  }

  /**
   * Fetches a single container per couple barcode+competitor (most recently created/updated/used one):
   * @see https://stackoverflow.com/a/49963644
   *
   * @param {Realm.Results<Container>} containers
   * @return {Realm.Results<Container>}
   */
  filteredByMostRecentPerBarcodeAndCompetitor(containers) {
    return containers.filtered('TRUEPREDICATE SORT(updatedAt DESC) DISTINCT (barcode, competitor)');
  }
}
