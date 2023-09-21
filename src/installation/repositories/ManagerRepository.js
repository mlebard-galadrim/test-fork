import AbstractRepository from 'k2/app/modules/common/repositories/AbstractRepository';
import Manager from 'k2/app/modules/installation/models/Manager';

export default class ManagerRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm, Manager.schema);
  }
}
