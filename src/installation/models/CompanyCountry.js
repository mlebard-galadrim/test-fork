import Enum from 'k2/app/modules/common/models/Enum';

class CompanyCountry extends Enum {
  static FR = 'FR';
  static ES = 'ES';
  static CH = 'CH';
  static GB = 'GB';
  static DE = 'DE';
  static BE = 'BE';
  static NL = 'NL';

  static values = [
    CompanyCountry.FR,
    CompanyCountry.ES,
    CompanyCountry.CH,
    CompanyCountry.GB,
    CompanyCountry.DE,
    CompanyCountry.BE,
    CompanyCountry.NL,
  ];

  static readables = {
    [CompanyCountry.FR]: 'fr',
    [CompanyCountry.ES]: 'es',
    [CompanyCountry.CH]: 'ch',
    [CompanyCountry.GB]: 'gb',
    [CompanyCountry.DE]: 'de',
    [CompanyCountry.BE]: 'be',
    [CompanyCountry.NL]: 'nl',
  };

  /**
   * @return {Boolean}
   */
  carriersNeedsTransportAuthorizationPrefectureNumber() {
    return this.is(CompanyCountry.FR);
  }

  /**
   * @return {Boolean}
   */
  needsSiret() {
    return this.is(CompanyCountry.FR);
  }

  /**
   * @return {Boolean}
   */
  needsVatCode() {
    return !this.is(CompanyCountry.FR);
  }

  /**
   * @return {Boolean}
   */
  allowsIndividual() {
    return this.is(CompanyCountry.FR);
  }

  /**
   * @return {Boolean}
   */
  usesTrackdechets() {
    return this.is(CompanyCountry.FR);
  }

  /**
   * @return {Boolean}
   */
  canUseVatCode() {
    return true;
  }
}

export default CompanyCountry;
