import AbstractRepository from '../../common/repositories/AbstractRepository';
import OilFamily from '../models/OilFamily';

class OilFamilyRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, OilFamily.schema);
  }
}

export default OilFamilyRepository;
