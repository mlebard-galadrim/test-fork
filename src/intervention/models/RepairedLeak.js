/**
 * Represents a leak reparation declaration within an intervention.
 * The leak can target a component
 */
class RepairedLeak {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String} leakUuid The leak uuid.
   *
   * @return {RepairedLeak}
   */
  static create(leakUuid) {
    const instance = new this();

    instance.leakUuid = leakUuid;

    return instance;
  }

  /**
   * Recursively clone the object
   *
   * @return {ContainerLoad}
   */
  clone() {
    return Object.assign(new RepairedLeak(), this);
  }
}

RepairedLeak.schema = {
  name: 'RepairedLeak',
  properties: {
    leakUuid: { type: 'string' },
  },
};

export default RepairedLeak;
