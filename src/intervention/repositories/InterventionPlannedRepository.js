import AbstractRepository from '../../common/repositories/AbstractRepository';
import InterventionPlanned from '../models/InterventionPlanned';

class InterventionPlannedRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, InterventionPlanned.schema);
  }
}

export default InterventionPlannedRepository;
