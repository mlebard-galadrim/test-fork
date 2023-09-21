import AbstractRepository from '../../common/repositories/AbstractRepository';
import Transfer from 'k2/app/modules/transfer/models/Transfer';

export default class TransferRepository extends AbstractRepository {
  constructor(realm) {
    super(realm, Transfer.schema);
  }

  /**
   * @return {Transfer[]}
   */
  findUnsynced() {
    return super.findUnsynced().sorted('date', false);
  }
}
