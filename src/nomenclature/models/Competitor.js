class Competitor {
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

Competitor.schema = {
  name: 'Competitor',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'string',
  },
};

export default Competitor;
