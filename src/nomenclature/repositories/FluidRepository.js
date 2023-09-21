import AbstractRepository from '../../common/repositories/AbstractRepository';
import Fluid from '../models/Fluid';

class FluidRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, Fluid.schema);
  }

  findAllForPrimaryCircuit() {
    return super.findAll().filtered('usableInPrimaryCircuit == true').sorted('designation');
  }

  findAll() {
    return super.findAll().sorted('designation');
  }
}

export default FluidRepository;
