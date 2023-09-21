import AbstractRepository from 'k2/app/modules/common/repositories/AbstractRepository';
import Contact from 'k2/app/modules/installation/models/Contact';

export default class ContactRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm, Contact.schema);
  }
}
