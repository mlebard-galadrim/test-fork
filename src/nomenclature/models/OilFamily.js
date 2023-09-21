class OilFamily {
  constructor() {
    // noop for realm
  }

  /**
   * @param {String} uuid
   * @param {Translation} designation
   */
  static create(uuid, designation) {
    const instance = new this();

    instance.uuid = uuid;
    instance.designation = designation;

    return instance;
  }
}

OilFamily.schema = {
  name: 'OilFamily',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'Translation',
  },
};

export default OilFamily;
