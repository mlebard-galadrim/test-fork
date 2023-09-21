import AbstractRepository from '../../common/repositories/AbstractRepository';
import Leak from '../models/Leak';

class LeakRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, Leak.schema);
  }
}

export default LeakRepository;
