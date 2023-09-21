class ComponentNatureType {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String} uuid
   * @param {Translation} designation
   * @param {ComponentNature} nature
   * @param {Array} translations
   *
   * @return {ComponentNatureType}
   */
  static create(uuid, designation, nature) {
    const instance = new this();

    instance.uuid = uuid;
    instance.designation = designation;
    instance.nature = nature;

    return instance;
  }
}

ComponentNatureType.schema = {
  name: 'ComponentNatureType',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'Translation',
    nature: 'ComponentNature',
  },
};

export default ComponentNatureType;
