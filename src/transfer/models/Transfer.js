import UUID from 'react-native-uuid';

/**
 * Represents an operation transferring fluids between two containers.
 *
 * @property {String} uuid
 * @property {Container} source
 * @property {Container} target
 * @property {Number} transferredLoad
 * @property {Date} date
 * @property {Boolean} synced
 */
class Transfer {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {Container} source
   * @param {Container} target
   * @param {Number}    transferredLoad
   *
   * @return {Transfer}
   */
  static create(source, target, transferredLoad) {
    const instance = new this();

    instance.uuid = UUID.v4();
    instance.source = source;
    instance.target = target;
    instance.transferredLoad = transferredLoad;
    instance.date = new Date();
    instance.synced = false;

    source.useInTransferAsSource(instance);
    target.useInTransferAsTarget(instance);

    return instance;
  }

  /**
   * Recursively clone the object
   *
   * @return {Transfer}
   */
  clone() {
    return Object.assign(new Transfer(), this);
  }
}

Transfer.schema = {
  name: 'Transfer',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    source: 'Container',
    target: 'Container',
    transferredLoad: 'double',
    date: 'date',
    synced: 'bool',
  },
};

export default Transfer;
