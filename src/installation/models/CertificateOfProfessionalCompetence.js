class CertificateOfProfessionalCompetence {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String} number
   * @param {Date}   startDate
   * @param {Date}   endDate
   *
   * @return {CertificateOfProfessionalCompetence}
   */
  static create(number, startDate, endDate) {
    const instance = new this();

    instance.number = number;
    instance.startDate = startDate;
    instance.endDate = endDate;

    return instance;
  }
}

CertificateOfProfessionalCompetence.schema = {
  name: 'CertificateOfProfessionalCompetence',
  primaryKey: 'number',
  properties: {
    number: 'string',
    startDate: 'date',
    endDate: 'date',
  },
};

export default CertificateOfProfessionalCompetence;
