import Enum from '../../common/models/Enum';

/**
 * Available coolant container values for a coolant drainage intervention
 */
class CoolantContainerType extends Enum {
  // Fut
  static BARREL = 'barrel';

  // GRV
  static BULK = 'bulk';

  // Citerne
  static TANK = 'tank';

  static values = [CoolantContainerType.BARREL, CoolantContainerType.BULK, CoolantContainerType.TANK];

  static readables = {
    [CoolantContainerType.BARREL]: 'enum:intervention:coolant_container_type:barrel',
    [CoolantContainerType.BULK]: 'enum:intervention:coolant_container_type:bulk',
    [CoolantContainerType.TANK]: 'enum:intervention:coolant_container_type:tank',
  };
}

export default CoolantContainerType;
