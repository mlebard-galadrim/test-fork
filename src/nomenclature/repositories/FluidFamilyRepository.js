import AbstractRepository from '../../common/repositories/AbstractRepository';
import FluidFamily from '../models/FluidFamily';

class FluidFamilyRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, FluidFamily.schema);
  }
}

export default FluidFamilyRepository;
