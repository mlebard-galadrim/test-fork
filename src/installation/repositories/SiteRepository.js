import AbstractRepository from '../../common/repositories/AbstractRepository';
import Site from '../models/Site';
import SiteFilter from '../filters/SiteFilter';
import ClientType from '../models/ClientType';
import ClientFilter from 'k2/app/modules/installation/filters/ClientFilter';

class SiteRepository extends AbstractRepository {
  /**
   * @param {Realm}    realm
   * @param {Security} security
   */
  constructor(realm, security) {
    super(realm, Site.schema);

    this.security = security;
  }

  /**
   * @return {Realm.Results|Site[]}
   */
  findByClientForFilter(client, filter) {
    switch (filter) {
      case SiteFilter.WITH_INSTALLATION:
        return this.findWithInstallations(this.findForClient(client));

      case SiteFilter.LEAKING:
        return this.findWithLeaks(this.findForClient(client));

      case SiteFilter.MOBILE:
        return this.findMobile(client);

      case SiteFilter.STANDARD_SITE:
        return this.findStandardSites(this.findForClient(client));

      case SiteFilter.FOR_SHIPPING_IN:
      case ClientFilter.FOR_SHIPPING_IN_WITH_DOCUMENT:
        return this.findForReception(client);

      case SiteFilter.WAREHOUSE:
        return this.findWarehouses(this.findForClient(client));

      case ClientFilter.FOR_MANAGEMENT:
        return this.findForManagement(client);

      case null:
        return this.findForClient(client);

      default:
        throw new Error(`Unsupported filter ${filter}.`);
    }
  }

  findForGivenLocationWithFilter(minLatitude, maxLatitude, minLongitude, maxLongitude, filter = null) {
    const query = this.findForGivenLocation(
      minLatitude,
      maxLatitude,
      minLongitude,
      maxLongitude,
      this.security.isCompanyUser(),
    );

    switch (filter) {
      case SiteFilter.WITH_INSTALLATION:
        return this.findWithInstallations(query);

      case SiteFilter.LEAKING:
        return this.findWithLeaks(query);

      case SiteFilter.STANDARD_SITE:
        return this.findStandardSites(query);

      case SiteFilter.WAREHOUSE:
        return this.findWarehouses(query);

      case null:
        return query;

      default:
        throw new Error(`Unsupported filter ${filter}.`);
    }
  }

  findForManagement(client, sort = ['city', 'name']) {
    return super
      .findAll()
      .filtered('client.id == $0', client.id)
      .filtered('city != $0', null) // not mobile
      .sorted(sort);
  }

  /**
   * Get array of sites sorted by city then name for a given client
   *
   * @param {Client} client
   *
   * @return {Realm.Results|Site[]}
   */
  findForClient(client, sort = ['city', 'name']) {
    return super
      .findAll()
      .filtered('client.id == $0', client.id)
      .filtered('city != $0', null)
      .filtered('treatmentSite == $0', false)
      .sorted(sort);
  }

  /**
   * Get array of sites (excluding warehouses)
   *
   * @param {Object} query
   *
   * @return {Realm.Results|Site[]}
   */
  findStandardSites(query) {
    return query.filtered('warehouse == $0', false);
  }

  /**
   * Get array of warehouses
   *
   * @param {Object} query
   *
   * @return {Realm.Results|Site[]}
   */
  findWarehouses(query) {
    return query.filtered('warehouse == $0', true);
  }

  /**
   * @param {float}   minLatitude
   * @param {float}   maxLatitude
   * @param {float}   minLongitude
   * @param {float}   maxLongitude
   * @param {boolean} excludeCompanySites
   *
   * @return {Realm.Results|Site[]}
   */
  findForGivenLocation(minLatitude, maxLatitude, minLongitude, maxLongitude, excludeCompanySites = true) {
    const results = super.findAll();

    if (excludeCompanySites) {
      results.filtered('client.type != $0', ClientType.COMPANY); // Exclude suppliers sites
    }

    return results
      .filtered('treatmentSite == $0', false) // Exclude treatment sites
      .filtered('latitude != $0', null)
      .filtered('longitude != $0', null)
      .filtered(`latitude >= ${minLatitude}`)
      .filtered(`latitude <= ${maxLatitude}`)
      .filtered(`longitude >= ${minLongitude}`)
      .filtered(`longitude <= ${maxLongitude}`);
  }

  /**
   * Get array of sites sorted by city then name for a given query
   *
   * @param {Object} query
   *
   * @return {Realm.Results|Site[]}
   */
  findWithInstallations(query) {
    return query.filtered('installations.id != $0', null);
  }

  /**
   * Get leaking sites
   *
   * @param {Object} query
   * @param {Boolean} leaking
   *
   * @return {Realm.Results|Site[]}
   */
  findWithLeaks(query, leaking = true) {
    return this.findWithInstallations(query).filtered('installations.leaks.repaired == $0', !leaking);
  }

  /**
   * Get array of mobile sites sorted by name for a given client
   *
   * @param {Client} client
   *
   * @return {Realm.Results|Site[]}
   */
  findMobile(client, sort = ['name']) {
    return super
      .findAll()
      .filtered('client.id == $0', client.id)
      .filtered('city == $0', null)
      .filtered('treatmentSite == $0', false)
      .sorted(sort);
  }

  /**
   * Get array of sites sorted by city then name for a given client, for reception
   *
   * @param {Client} client
   *
   * @return {Realm.Results|Site[]}
   */
  findForReception(client, sort = ['city', 'name']) {
    return super.findAll().filtered('client.id == $0', client.id).filtered('city != $0', null).sorted(sort);
  }

  /**
   * Get array of sites with treatment site
   *
   * @param {String[]} sort
   * @param {?Client} client
   *
   * @return {Realm.Results|Site[]}
   */
  findAllTreatmentSite(sort = ['name'], client = null) {
    let results = super.findAll().filtered('treatmentSite == $0', true);
    if (client) {
      results = this._filterByClientExternalIds(results, client);
    }

    return results.sorted(sort);
  }

  /**
   * Find all supplier sites.
   *
   * @return {Realm.Results|Site[]}
   */
  findSuppliersAndDistributors(sort = ['name'], client = null) {
    let results = super
      .findAll()
      .filtered('client.distributor == $0 || client.type == $1', true, ClientType.COMPANY)
      .filtered('warehouse == $0', true)
      .filtered('treatmentSite == $0', false);

    if (client) {
      results = this._filterByClientExternalIds(results, client);
    }

    return results.sorted(sort);
  }

  /**
   * Filters out results by only including those with matching client id, full external id or parent external ids.
   * E.G: 10-20-30 will include sites directly associated to 10, 10-20 and 10-20-30 clients.
   *
   * @private
   *
   * @param {Realm.Results|Site[]} results
   * @param {Client} client
   *
   * @return {Realm.Results|Site[]}
   */
  _filterByClientExternalIds(results, client) {
    const externalIds = client.fullExternalId ? client.fullExternalId.split('-') : [];
    const [first, second, third] = externalIds;
    const conditions = [];

    first && conditions.push(`client.fullExternalId == "${first}"`);
    second && conditions.push(`client.fullExternalId == "${first}-${second}"`);
    third && conditions.push(`client.fullExternalId == "${first}-${second}-${third}"`);

    const externalIdsCondition = conditions.length > 0 ? ` OR (${conditions.join(' OR ')})` : '';

    return results.filtered(`client.id == $0${externalIdsCondition}`, client.id);
  }

  /**
   * @return {Realm.Results|Site[]}
   */
  findUnsynced() {
    return this.getTable().filtered('synced == $0', false);
  }
}

export default SiteRepository;
