import AbstractRepository from '../../common/repositories/AbstractRepository';
import Oil from '../models/Oil';

class OilRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, Oil.schema);
  }

  /**
   * {@inheritDoc}
   */
  findAll() {
    return super.findAll().sorted('designation');
  }
}

export default OilRepository;
