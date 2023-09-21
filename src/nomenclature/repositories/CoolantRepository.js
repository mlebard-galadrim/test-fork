import AbstractRepository from '../../common/repositories/AbstractRepository';
import Coolant from '../models/Coolant';

class CoolantRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, Coolant.schema);
  }
}

export default CoolantRepository;
