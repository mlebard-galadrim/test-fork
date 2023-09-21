export default class ClientInfos {
  static schema = {
    name: 'ClientInfos',
    properties: {
      parent: 'Client',
      siret: 'string?',
      vatCode: 'string?',
      individual: 'bool',
    },
  };

  static create(parent, siret, vatCode, individual) {
    const instance = new this();

    instance.parent = parent;
    instance.siret = siret;
    instance.vatCode = vatCode;
    instance.individual = individual;

    return instance;
  }
}
