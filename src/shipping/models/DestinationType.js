import Enum from '../../common/models/Enum';

/**
 * Available destination types for a shipping out
 */
class DestinationType extends Enum {
  static TREATMENT_SITE = 'treatment_site';

  static SUPPLIER = 'supplier';

  static MY_SITES = 'my_sites';

  static MY_WAREHOUSES = 'my_warehouses';

  static MY_MOBILE_SITES = 'my_mobile_sites';

  static values = [
    DestinationType.TREATMENT_SITE,
    DestinationType.SUPPLIER,
    DestinationType.MY_SITES,
    DestinationType.MY_WAREHOUSES,
    DestinationType.MY_MOBILE_SITES,
  ];

  static readables = {
    [DestinationType.TREATMENT_SITE]: 'enum:shipping:destination_type:treatment_site',
    [DestinationType.SUPPLIER]: 'enum:shipping:destination_type:supplier',
    [DestinationType.MY_SITES]: 'enum:shipping:destination_type:my_sites',
    [DestinationType.MY_WAREHOUSES]: 'enum:shipping:destination_type:my_warehouses',
    [DestinationType.MY_MOBILE_SITES]: 'enum:shipping:destination_type:my_mobile_sites',
  };
}

export default DestinationType;
