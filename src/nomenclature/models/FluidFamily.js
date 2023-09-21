class FluidFamily {
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

FluidFamily.schema = {
  name: 'FluidFamily',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'string',
  },
};

export default FluidFamily;
