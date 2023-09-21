class OilBrand {
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

OilBrand.schema = {
  name: 'OilBrand',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'string',
  },
};

export default OilBrand;
