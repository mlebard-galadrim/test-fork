import AbstractRepository from '../../common/repositories/AbstractRepository';
import InstallationApplication from '../models/InstallationApplication';

class InstallationApplicationRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, InstallationApplication.schema);
  }
}

export default InstallationApplicationRepository;
