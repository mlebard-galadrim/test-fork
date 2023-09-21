import SiteFilter from './SiteFilter';

/**
 * Client filter
 */
class ClientFilter extends SiteFilter {
  static WITH_SITE = 'with_site';

  static DISTRIBUTOR = 'distributor';

  static values = SiteFilter.values.concat([ClientFilter.WITH_SITE, ClientFilter.DISTRIBUTOR]);

  static readables = Object.assign({}, SiteFilter.readables, {
    [ClientFilter.WITH_SITE]: 'enum:client_filter:with_site',
    [ClientFilter.DISTRIBUTOR]: 'enum:client_filter:distributor',
  });

  static isExcluding(value) {
    return super.isExcluding(value) || value === this.WITH_SITE;
  }

  static hasInstallation(value) {
    return super.hasInstallation(value) && value !== this.DISTRIBUTOR;
  }
}

export default ClientFilter;
