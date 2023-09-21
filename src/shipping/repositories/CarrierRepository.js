import AbstractRepository from '../../common/repositories/AbstractRepository';
import Carrier from '../models/Carrier';

class CarrierRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm, Carrier.schema);
  }

  /**
   * {@inheritDoc}
   */
  findAll(sort = ['city', 'name']) {
    return super.findAll().sorted(sort);
  }
}

export default CarrierRepository;
