class ComponentNature {
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
   * @return {ComponentNature}
   */
  static create(uuid, designation) {
    const instance = new this();

    instance.uuid = uuid;
    instance.designation = designation;

    return instance;
  }
}

ComponentNature.schema = {
  name: 'ComponentNature',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'Translation',
  },
};

export default ComponentNature;
