import AbstractRepository from 'k2/app/modules/common/repositories/AbstractRepository';
import ClientInfos from 'k2/app/modules/installation/models/ClientInfos';

export default class ClientInfosRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm, ClientInfos.schema);
  }
}
