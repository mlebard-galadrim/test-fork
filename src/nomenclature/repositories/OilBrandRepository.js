import AbstractRepository from '../../common/repositories/AbstractRepository';
import OilBrand from '../models/OilBrand';

class OilBrandRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, OilBrand.schema);
  }
}

export default OilBrandRepository;
