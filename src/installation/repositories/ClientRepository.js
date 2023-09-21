import AbstractRepository from '../../common/repositories/AbstractRepository';
import Client from '../models/Client';
import ClientType from '../models/ClientType';
import ClientFilter from '../filters/ClientFilter';

class ClientRepository extends AbstractRepository {
  /**
   * @param {Realm}    realm
   * @param {Security} security
   */
  constructor(realm, security) {
    super(realm, Client.schema);

    this.security = security;
  }

  /**
   * Find all clients from my hierarchy (excluding the company)
   *
   * @return {Client[]}
   */
  findAllFromMyHierarchy() {
    let results = this.findAll().filtered('partOfMyHierarchy == true').sorted('name');

    if (this.security.isCompanyUser()) {
      return results;
    }

    return results.filtered('type != $0', ClientType.COMPANY);
  }

  findForFilter(filter) {
    switch (filter) {
      case ClientFilter.TREATMENT:
        return this.findAllTreatmentSites();

      case ClientFilter.DISTRIBUTOR:
        return this.findAllDistributors();

      case ClientFilter.MOBILE:
        return this.findWithMobileSites();

      case ClientFilter.LEAKING:
        return this.findWithLeaks();

      case ClientFilter.WITH_INSTALLATION:
        return this.findWithInstallations();

      case ClientFilter.WITH_SITE:
        return this.findWithSites();

      case ClientFilter.FOR_SHIPPING_IN:
        return this.findForShippingIn();

      case ClientFilter.FOR_SHIPPING_IN_WITH_DOCUMENT:
        return this.findForShippingInWithArianeOperationByCfUser();

      case ClientFilter.STANDARD_SITE:
        return this.findWithStandardSites();

      case ClientFilter.WAREHOUSE:
        return this.findWithWarehouses();

      case ClientFilter.FOR_MANAGEMENT:
        return this.findForManagement();

      case null:
        return this.findAll();

      default:
        throw new Error(`Unsupported filter ${filter}.`);
    }
  }

  findForManagement() {
    return this.findAllFromMyHierarchy();
  }

  findWithInstallations() {
    return this.findWithSites().filtered('sites.installations.id != $0', null);
  }

  findWithMobileSites() {
    return this.findAllFromMyHierarchy()
      .filtered('sites.id != $0', null)
      .filtered('sites.city == $0', null)
      .filtered('sites.treatmentSite == $0', false);
  }

  findWithLeaks(leaking = true) {
    return this.findWithInstallations().filtered('sites.installations.leaks.repaired == $0', !leaking);
  }

  findAllDistributors(sort = ['name']) {
    return this.findWithSites().filtered('distributor == $0', true).sorted(sort);
  }

  findAllTreatmentSites(sort = ['name']) {
    return this.findAllFromMyHierarchy().filtered('sites.treatmentSite == $0', true).sorted(sort);
  }

  findWithWarehouses(sort) {
    return this.findWithSites(sort).filtered('sites.warehouse == $0', true);
  }

  findWithStandardSites(sort) {
    return this.findWithSites(sort).filtered('sites.warehouse == $0', false);
  }

  /**
   * Find with final site (no treatment, no mobile)
   */
  findWithSites(sort = ['name']) {
    return this._filterWithSites(this.findAllFromMyHierarchy()).sorted(sort);
  }

  _filterWithSites(results, noTreatment = true, noMobile = true) {
    let r = results.filtered('sites.id != $0', null);

    if (noMobile) {
      r = r.filtered('sites.city != $0', null);
    }

    if (noTreatment) {
      r = r.filtered('sites.treatmentSite == $0', false);
    }

    return r;
  }

  findForShippingIn(sort = ['name']) {
    const isUserDistributor = this.security.getUserClient().distributor;

    return (
      this._filterWithSites(this.findAllFromMyHierarchy())
        // As a distributor user, I must be able to see my own sites
        .filtered('distributor == $0', isUserDistributor)
        .sorted(sort)
    );
  }

  findForShippingInWithArianeOperationByCfUser(sort = ['name']) {
    return this._filterWithSites(this.findAllFromMyHierarchy(), false)
      .filtered('type == $0 OR id == $1', ClientType.DO, this.security.getUserProfile().clientUuid)
      .sorted(sort);
  }

  /**
   * @param {String} externalId
   *
   * @returns {?Client}
   */
  findWithFullExternalId(externalId) {
    const result = this.findAll().filtered('fullExternalId == $0', externalId);

    return result.length ? result[0] : null;
  }

  /**
   * @return {Client[]}
   */
  findUnsynced() {
    return this.getTable().filtered('synced == $0', false);
  }
}

export default ClientRepository;
