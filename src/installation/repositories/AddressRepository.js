import AbstractRepository from 'k2/app/modules/common/repositories/AbstractRepository';
import Address from 'k2/app/modules/installation/models/Address';

export default class AddressRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm, Address.schema);
  }
}
