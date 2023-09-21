export default class Manager {
  static schema = {
    name: 'Manager',
    properties: {
      name: 'string',
      signature: 'string?',
    },
  };

  /**
   * @param  {String} name
   * @param  {String|null} signature
   *
   * @return {Manager}
   */
  static create(name, signature = null) {
    const instance = new this();

    instance.name = name;
    instance.signature = signature;

    return instance;
  }
}
