import Enum from '../../common/models/Enum';

/**
 * Available ShippingType (Envoi et Réception)
 */
class ShippingType extends Enum {
  static IN = 'in';

  static OUT = 'out';

  static values = [ShippingType.IN, ShippingType.OUT];

  static readables = {
    [ShippingType.IN]: 'enum:shipping_type:in',
    [ShippingType.OUT]: 'enum:shipping_type:out',
  };
}

export default ShippingType;
