import Intervention from '../models/Intervention';
import InterventionType from '../models/InterventionType';
import Purpose from '../models/Purpose';

class NextOperationResolver {
  /**
   * Resolve the next operation(s) to possibly do after given operation.
   *
   * @param {Intervention|Shipping|null} operation
   *
   * @return {String[]} The next suggested operations (a ShippingType or InterventionType value)
   */
  resolve(operation) {
    if (operation instanceof Intervention) {
      const { type, purpose } = operation;

      if (InterventionType.FILLING === type && Purpose.COMMISSIONING === purpose) {
        return [new InterventionType(InterventionType.LEAK)];
      }

      if (InterventionType.DRAINAGE === type && Purpose.TRANSFER === purpose) {
        return [new InterventionType(InterventionType.LEAK_REPAIR), new InterventionType(InterventionType.FILLING)];
      }

      if (InterventionType.LEAK === type) {
        return [new InterventionType(InterventionType.DRAINAGE)];
      }
    }

    return [];
  }
}

export default NextOperationResolver;
