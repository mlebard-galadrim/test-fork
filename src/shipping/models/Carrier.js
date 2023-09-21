class Carrier {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {int} id
   * @param {string} name
   * @param {string} city
   * @param {Client} client
   * @param {Date}   authorizationExpirationDate
   *
   * @return {Carrier}
   */
  static create(id, name, city, client, transportAuthorizationExpirationDate) {
    const instance = new this();

    instance.id = id;
    instance.name = name;
    instance.city = city;
    instance.client = client;
    instance.transportAuthorizationExpirationDate = transportAuthorizationExpirationDate;

    return instance;
  }
}

Carrier.schema = {
  name: 'Carrier',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name: 'string',
    city: 'string',
    client: 'Client',
    transportAuthorizationExpirationDate: 'date',
  },
};

export default Carrier;
