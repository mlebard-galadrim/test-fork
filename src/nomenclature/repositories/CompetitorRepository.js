import AbstractRepository from '../../common/repositories/AbstractRepository';
import Competitor from '../models/Competitor';

class CompetitorRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, Competitor.schema);
  }
}

export default CompetitorRepository;
