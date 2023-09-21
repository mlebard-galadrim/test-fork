class ComponentBrand {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String} uuid
   * @param {String} designation
   *
   * @return {ComponentBrand}
   */
  static create(uuid, designation) {
    const instance = new this();

    instance.uuid = uuid;
    instance.designation = designation;

    return instance;
  }
}

ComponentBrand.schema = {
  name: 'ComponentBrand',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'string',
  },
};

export default ComponentBrand;
