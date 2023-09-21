import UUID from 'react-native-uuid';

/**
 * Represents a leak declaration within an intervention.
 * The leak can target a component
 */
class Leak {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String|null} componentUuid The component identifier. Null if not a component leak.
   * @param {String}      location      The description of the component location.
   * @param {Boolean}     repaired      Whether the leak is repaired yet or not.
   * @param {String|null} uuid
   *
   * @return {Leak}
   */
  static create(componentUuid, location, repaired = false, uuid = UUID.v4()) {
    const instance = new this();

    instance.uuid = uuid;
    instance.componentUuid = componentUuid;
    instance.location = location;
    instance.repaired = repaired;

    return instance;
  }

  /**
   * Recursively clone the object
   *
   * @return {ContainerLoad}
   */
  clone() {
    return Object.assign(new Leak(), this);
  }
}

Leak.schema = {
  name: 'Leak',
  primaryKey: 'uuid',
  properties: {
    uuid: { type: 'string' },
    componentUuid: { type: 'string', optional: true },
    location: 'string',
    repaired: 'bool',
  },
};

export default Leak;
