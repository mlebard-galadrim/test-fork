import AbstractRepository from '../../common/repositories/AbstractRepository';
import ControlPeriodicity from '../models/ControlPeriodicity';

class ControlPeriodicityRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, ControlPeriodicity.schema);
  }
}

export default ControlPeriodicityRepository;
