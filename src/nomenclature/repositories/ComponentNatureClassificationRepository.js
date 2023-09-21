import AbstractRepository from '../../common/repositories/AbstractRepository';
import ComponentNatureClassification from '../models/ComponentNatureClassification';

class ComponentNatureClassificationRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, ComponentNatureClassification.schema);
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

export default ComponentNatureClassificationRepository;
