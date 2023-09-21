class InstallationType {
  constructor() {
    // noop for realm
  }

  static create(uuid, designation) {
    const instance = new this();

    instance.uuid = uuid;
    instance.designation = designation;

    return instance;
  }
}

InstallationType.schema = {
  name: 'InstallationType',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'Translation',
  },
};

export default InstallationType;
