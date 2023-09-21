import AbstractRepository from '../../common/repositories/AbstractRepository';
import ComponentBrand from '../models/ComponentBrand';

class ComponentBrandRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, ComponentBrand.schema);
  }

  /**
   * {@inheritDoc}
   */
  findAll() {
    return super.findAll();
  }
}

export default ComponentBrandRepository;
