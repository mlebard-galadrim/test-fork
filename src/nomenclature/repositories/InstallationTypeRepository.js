import AbstractRepository from '../../common/repositories/AbstractRepository';
import InstallationType from '../models/InstallationType';

class InstallationTypeRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, InstallationType.schema);
  }

  findAll() {
    return super.findAll();
  }
}

export default InstallationTypeRepository;
