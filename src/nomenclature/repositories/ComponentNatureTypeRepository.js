import AbstractRepository from '../../common/repositories/AbstractRepository';
import ComponentNatureType from '../models/ComponentNatureType';

class ComponentNatureTypeRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, ComponentNatureType.schema);
  }

  /**
   * @param {ComponentNature} nature
   *
   * @return {Array}
   */
  findByNature(nature) {
    return Array.from(super.findAll().filtered('nature.uuid == $0', nature.uuid));
  }
}

export default ComponentNatureTypeRepository;
