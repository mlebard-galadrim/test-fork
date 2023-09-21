/**
 * @property {Client} client
 * @property {String} name
 * @property {Boolean} treatmentSite
 */
class Site {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {int} id
   * @param {string} name
   * @param {string|null} city
   * @param {Client} client
   * @param {float|null} latitude
   * @param {float|null} longitude
   * @param {Boolean} treatmentSite
   * @param {Boolean} warehouse
   * @param {Installation[]} installations
   *
   * @return {Site}
   */
  static create(
    id,
    name,
    city,
    client,
    latitude = null,
    longitude = null,
    treatmentSite = false,
    warehouse = false,
    installations = [],
    synced = false,
  ) {
    const instance = new this();

    instance.id = id;
    instance.name = name;
    instance.city = city;
    instance.client = client;
    instance.treatmentSite = treatmentSite;
    instance.warehouse = warehouse;
    instance.installations = installations;
    instance.latitude = latitude;
    instance.longitude = longitude;
    instance.synced = synced;

    return instance;
  }

  isMobile() {
    return this.city === null;
  }

  /**
   * Is this the same site?
   *
   * @param {Site} site
   *
   * @return {Boolean}
   */
  is(site) {
    return this.id === site.id;
  }
}

Site.schema = {
  name: 'Site',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    city: 'string?',
    treatmentSite: 'bool',
    warehouse: 'bool',
    client: 'Client',
    installations: { type: 'list', objectType: 'Installation' },
    latitude: 'double?',
    longitude: 'double?',
    address: { type: 'Address', optional: true },
    contact: { type: 'Contact', optional: true },
    manager: { type: 'Manager', optional: true },
    synced: { type: 'bool', default: true },
  },
};

export default Site;
