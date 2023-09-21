import UUID from 'react-native-uuid';

class Analysis {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String} uuid             The analysis' uuid
   * @param {String} installationUuid The installation uuid
   * @param {String} componentUuid    The compressor uuid
   * @param {String} type             The type of analysis
   * @param {String} kitBarcode       The barcode of the kit
   * @param {Date}   creation         The analysis intervention creation date
   *
   * @return {Analysis}
   */
  static create(uuid, installationUuid, componentUuid, type, kitBarcode, creation, synced = false) {
    const instance = new this();

    instance.uuid = uuid ?? UUID.v4();
    instance.installationUuid = installationUuid;
    instance.componentUuid = componentUuid;
    instance.type = type;
    instance.kitBarcode = kitBarcode;
    instance.creation = creation;
    instance.synced = synced;

    return instance;
  }
}

Analysis.schema = {
  name: 'Analysis',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    kitBarcode: 'string',
    installationUuid: 'string',
    componentUuid: 'string',
    type: 'string',
    creation: 'date',
    synced: 'bool',
  },
};

export default Analysis;
