import UUID from 'react-native-uuid';

/**
 * @member {String} uuid
 * @member {?String} externalId
 * @member {String} designation
 * @member {?Fluid} fluid
 * @member {?Number} quantity
 * @member {?Number} volume
 * @member {?String} pressure one of {@see Pressure}
 * @member {Boolean} belongsToMyCompany
 * @member {?Competitor} competitor
 * @member {?Article} articleIfEmpty
 */
class Article {
  constructor() {
    // noop for realm
  }

  static create(
    uuid,
    externalId,
    designation,
    fluid,
    quantity,
    volume,
    pressure,
    belongsToMyCompany,
    competitor = null,
  ) {
    const instance = new this();

    instance.uuid = uuid;
    instance.externalId = externalId;
    instance.designation = designation;
    instance.fluid = fluid;
    instance.quantity = quantity;
    instance.volume = volume;
    instance.pressure = pressure;
    instance.competitor = competitor;
    instance.belongsToMyCompany = belongsToMyCompany;
    instance.articleIfEmpty = null;

    return instance;
  }

  static createUnknown(designation, fluid, quantity, volume, pressure, competitor) {
    return this.create(UUID.v4(), null, designation, fluid, quantity, volume, pressure, true, competitor);
  }

  /**
   * Updates an existing article.
   */
  update(pressure) {
    this.pressure = pressure;
  }

  /**
   * Get capacity (kg)
   *
   * @param {Fluid|null} fluid Mandatory for drainage if the article has no fluid attached
   * @param {Number|null} defaultValue
   * @return {Number|null}
   */
  getCapacity(fluid = null, defaultValue = null) {
    if (this.quantity) {
      return this.quantity ?? defaultValue;
    }

    if (!fluid) {
      return defaultValue;
    }

    return this.volume * (fluid.wasteLoadPercent / 100);
  }
}

Article.schema = {
  name: 'Article',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    externalId: 'string?', // Null for unknown articles
    designation: 'string',
    fluid: 'Fluid',
    quantity: { type: 'double', optional: true },
    volume: { type: 'double', optional: true },
    pressure: { type: 'string', optional: true },
    belongsToMyCompany: { type: 'bool', default: true },
    competitor: 'Competitor',
    articleIfEmpty: { type: 'Article', optional: true },
  },
};

export default Article;
