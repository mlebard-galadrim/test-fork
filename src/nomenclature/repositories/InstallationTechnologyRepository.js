import AbstractRepository from '../../common/repositories/AbstractRepository';
import InstallationTechnology from '../models/InstallationTechnology';

class InstallationTechnologyRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, InstallationTechnology.schema);
  }
}

export default InstallationTechnologyRepository;
