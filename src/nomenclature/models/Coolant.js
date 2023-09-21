class Coolant {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String} uuid
   * @param {Translation} designation
   *
   * @return {Coolant}
   */
  static create(uuid, designation) {
    const instance = new this();

    instance.uuid = uuid;
    instance.designation = designation;

    return instance;
  }
}

Coolant.schema = {
  name: 'Coolant',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'Translation',
  },
};

export default Coolant;
