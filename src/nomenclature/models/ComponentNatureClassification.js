class ComponentNatureClassification {
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
   * @return {ComponentNatureClassification}
   */
  static create(uuid, designation, nature) {
    const instance = new this();

    instance.uuid = uuid;
    instance.designation = designation;
    instance.nature = nature;

    return instance;
  }
}

ComponentNatureClassification.schema = {
  name: 'ComponentNatureClassification',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'Translation',
    nature: 'ComponentNature',
  },
};

export default ComponentNatureClassification;
