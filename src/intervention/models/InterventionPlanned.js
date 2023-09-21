import InterventionType from './InterventionType';
import Purpose from './Purpose';

class InterventionPlanned {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  static fromApi(uuid, installation, type, purpose, plannedAt) {
    const instance = new this();

    instance.id = uuid;
    instance.type = type;
    instance.purpose = instance.type === InterventionType.LEAK_REPAIR ? Purpose.CONTROL_NON_PERIODIC : purpose;
    instance.installation = installation;
    instance.plannedAt = new Date(plannedAt);

    return instance;
  }
}

InterventionPlanned.schema = {
  name: 'InterventionPlanned',
  primaryKey: 'id',
  properties: {
    id: 'string',
    type: 'string',
    purpose: { type: 'string', optional: true },
    installation: 'string',
    plannedAt: { type: 'date', optional: true },
  },
};

export default InterventionPlanned;
