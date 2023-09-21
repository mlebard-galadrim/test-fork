export default class Address {
  static schema = {
    name: 'Address',
    properties: {
      street: 'string',
      addition: 'string?',
      postal: 'string',
      city: 'string',
      country: 'string',
    },
  };

  /**
   * @param  {String} street
   * @param  {String|null} addition
   * @param  {String} postal
   * @param  {String} city
   * @param  {String} country
   *
   * @return {Address}
   */
  static create(street, addition, postal, city, country) {
    const instance = new this();

    instance.street = street;
    instance.addition = addition;
    instance.postal = postal;
    instance.city = city;
    instance.country = country;

    return instance;
  }
}
