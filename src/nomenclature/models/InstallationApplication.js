class InstallationApplication {
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

InstallationApplication.schema = {
  name: 'InstallationApplication',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'Translation',
  },
};

export default InstallationApplication;
