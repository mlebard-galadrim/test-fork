class ControlPeriodicity {
  constructor() {
    // noop for realm
  }

  static create(uuid, fluidFamily, from, to, unit, withDetector, withoutDetector) {
    const instance = new this();

    instance.uuid = uuid;
    instance.fluidFamily = fluidFamily;
    instance.from = from;
    instance.to = to;
    instance.unit = unit;
    instance.withDetector = withDetector;
    instance.withoutDetector = withoutDetector;

    return instance;
  }
}

ControlPeriodicity.schema = {
  name: 'ControlPeriodicity',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    fluidFamily: 'FluidFamily',
    from: 'int',
    to: 'int',
    unit: 'string',
    withDetector: 'int',
    withoutDetector: 'int',
  },
};

export default ControlPeriodicity;
