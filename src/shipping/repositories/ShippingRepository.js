import AbstractRepository from '../../common/repositories/AbstractRepository';
import Shipping from '../models/Shipping';

class ShippingRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm, Shipping.schema);
  }

  /**
   * @return {Shipping[]}
   */
  findUnsynced() {
    return super.findUnsynced().sorted('creation', false);
  }

  markAllAsSynced() {
    this.realm.write(() => {
      Array.from(this.findUnsynced()).forEach(shipping => (shipping.synced = true));
    });
  }
}

export default ShippingRepository;
