import AbstractRepository from '../../common/repositories/AbstractRepository';
import AnalysisType from '../models/AnalysisType';

class AnalysisTypeRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, AnalysisType.schema);
  }

  findAll() {
    return super.findAll().sorted('uuid');
  }

  /**
   * @param {string} analysisNature
   *
   * @returns Realm.Results<AnalysisType>
   */
  findAllOfNature(analysisNature) {
    return super.findAll().filtered('nature == $0', analysisNature).sorted('uuid');
  }
}

export default AnalysisTypeRepository;
