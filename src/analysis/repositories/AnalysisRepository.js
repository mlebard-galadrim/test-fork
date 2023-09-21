import AbstractRepository from '../../common/repositories/AbstractRepository';
import Analysis from '../models/Analysis';

class AnalysisRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   * @param {InterventionPlannedRepository} interventionPlannedRepository
   */
  constructor(realm, interventionPlannedRepository) {
    super(realm, Analysis.schema);

    this.interventionPlannedRepository = interventionPlannedRepository;
  }

  /**
   * @inheritdoc
   */
  save(object) {
    super.save(object);
    this.interventionPlannedRepository.deleteById(object.uuid);
  }
}

export default AnalysisRepository;
