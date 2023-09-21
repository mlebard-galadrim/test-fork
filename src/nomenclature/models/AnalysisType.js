/**
 * @member {String} uuid
 * @member {Translation} designation
 * @member {Translation} explanation
 * @member {string} nature One of {@link AnalysisNature.values}
 */
class AnalysisType {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  static fromApi(uuid, designation, explanation, nature) {
    const instance = new this();

    instance.uuid = uuid;
    instance.designation = designation;
    instance.explanation = explanation;
    instance.nature = nature;

    return instance;
  }
}

AnalysisType.schema = {
  name: 'AnalysisType',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'Translation',
    explanation: 'Translation',
    nature: 'string',
  },
};

export default AnalysisType;
