import ClientType from './ClientType';

/**
 * @property {?String} fullExternalId
 */
class Client {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String}                              id
   * @param {String|null}                         fullExternalId
   * @param {String}                              name
   * @param {ClientType|String}                   type                                A ClientType instance or value
   * @param {Site[]}                              sites
   * @param {Boolean}                             distributor
   * @param {CertificateOfProfessionalCompetence} certificateOfProfessionalCompetence
   * @param {Boolean}                             partOfMyHierarchy
   * @param {Boolean} synced
   *
   * @return {Client}
   */
  static create(
    id,
    fullExternalId,
    name,
    type,
    sites = [],
    distributor = false,
    certificateOfProfessionalCompetence = null,
    partOfMyHierarchy = true,
    synced = false,
  ) {
    const instance = new this();

    instance.id = id;
    instance.fullExternalId = fullExternalId;
    instance.name = name;
    instance.type = type instanceof ClientType ? type.value : new ClientType(type).value;
    instance.sites = sites;
    instance.distributor = distributor;
    instance.certificateOfProfessionalCompetence = certificateOfProfessionalCompetence;
    instance.partOfMyHierarchy = partOfMyHierarchy;
    instance.synced = synced;

    return instance;
  }

  /**
   * Ex:
   *  - "10-20-30" for CF type will result into "10-20"
   *  - "10-20" for Company type will result into "10"
   *  - "10-20" for DO type will result into `null`
   *
   * @param {ClientType|String} type
   *
   * @returns {String|null} The full external id for given client type if available
   */
  getFullExternalIdAtLvl(type) {
    if (this.fullExternalId === null) {
      return null;
    }

    const externalIds = this.fullExternalId.split('-');
    const [first, second, third] = externalIds;
    switch (type.value || type) {
      case ClientType.COMPANY:
        return first;
      case ClientType.CF:
        return second ? [first, second].join('-') : null;
      case ClientType.DO:
        return third ? this.fullExternalId : null;
    }

    throw new Error(`Unexpected type "${type.stringify()}" asked in "Client.getFullExternalIdAtLvl()"`);
  }
}

Client.schema = {
  name: 'Client',
  primaryKey: 'id',
  properties: {
    id: 'string',
    fullExternalId: 'string?',
    name: 'string',
    type: 'string',
    sites: { type: 'list', objectType: 'Site' },
    distributor: 'bool',
    partOfMyHierarchy: { type: 'bool', default: true },
    certificateOfProfessionalCompetence: {
      type: 'CertificateOfProfessionalCompetence',
      optional: true,
    },
    infos: { type: 'ClientInfos', optional: true },
    address: { type: 'Address', optional: true },
    synced: { type: 'bool', default: true },
  },
};

export default Client;
