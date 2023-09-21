import InstallationFilter from './InstallationFilter';

/**
 * Site filter
 */
class SiteFilter extends InstallationFilter {
  /** Find the sites I can manage: standard, non mobile sites */
  static FOR_MANAGEMENT = 'for_management';

  static WITH_INSTALLATION = 'with_installation';

  static MOBILE = 'mobile';

  static TREATMENT = 'treatment';

  static STANDARD_SITE = 'standard_site';

  static WAREHOUSE = 'warehouse';

  static SUPPLIER = 'supplier';

  static FOR_SHIPPING_IN = 'for_shipping_in';

  static FOR_SHIPPING_IN_WITH_DOCUMENT = 'for_shipping_in_with_document';

  static values = InstallationFilter.values.concat([
    SiteFilter.WITH_INSTALLATION,
    SiteFilter.MOBILE,
    SiteFilter.TREATMENT,
    SiteFilter.STANDARD_SITE,
    SiteFilter.WAREHOUSE,
    SiteFilter.SUPPLIER,
    SiteFilter.FOR_SHIPPING_IN,
    SiteFilter.FOR_SHIPPING_IN_WITH_DOCUMENT,
    SiteFilter.FOR_MANAGEMENT,
  ]);

  static readables = Object.assign({}, InstallationFilter.readables, {
    [SiteFilter.WITH_INSTALLATION]: 'enum:site_filter:with_installation',
    [SiteFilter.MOBILE]: 'enum:site_filter:mobile',
    [SiteFilter.TREATMENT]: 'enum:site_filter:treatment',
    [SiteFilter.STANDARD_SITE]: 'enum:site_filter:standard_site',
    [SiteFilter.WAREHOUSE]: 'enum:site_filter:warehouse',
    [SiteFilter.SUPPLIER]: 'enum:site_filter:supplier',
    [SiteFilter.FOR_SHIPPING_IN]: 'enum:site_filter:for_shipping_in',
    [SiteFilter.FOR_SHIPPING_IN_WITH_DOCUMENT]: 'enum:site_filter:for_shipping_in_with_document',
    [SiteFilter.FOR_MANAGEMENT]: 'enum:site_filter:for_management',
  });

  static isSiteOnly(value) {
    return (
      value === this.STANDARD_SITE ||
      value === this.MOBILE ||
      value === this.WAREHOUSE ||
      value === this.FOR_SHIPPING_IN ||
      value === this.FOR_SHIPPING_IN_WITH_DOCUMENT
    );
  }

  static isExcluding(value) {
    return (
      super.isExcluding(value) ||
      value === this.WITH_INSTALLATION ||
      value === this.STANDARD_SITE ||
      value === this.MOBILE ||
      value === this.WAREHOUSE /*||
      //value === this.FOR_SHIPPING_IN*/
    );
  }

  static hasInstallation(value) {
    return ![this.MOBILE, this.FOR_SHIPPING_IN, this.FOR_SHIPPING_IN_WITH_DOCUMENT].includes(value);
  }

  static hasAddress(value) {
    return value !== this.MOBILE;
  }
}

export default SiteFilter;
