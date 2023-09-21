import AbstractRepository from 'k2/app/modules/common/repositories/AbstractRepository';
import ArianeOperation from 'k2/app/modules/shipping/models/ArianeOperation';

class ArianeOperationRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm, ArianeOperation.schema);
  }
}

export default ArianeOperationRepository;
