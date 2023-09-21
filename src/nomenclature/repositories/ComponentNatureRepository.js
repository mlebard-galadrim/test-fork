import AbstractRepository from '../../common/repositories/AbstractRepository';
import ComponentNature from '../models/ComponentNature';

class ComponentNatureRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, ComponentNature.schema);
  }
}

export default ComponentNatureRepository;
