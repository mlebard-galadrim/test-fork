import Enum from '../../common/models/Enum';
import InterventionType from './InterventionType';

/**
 * Available purpose values for an Intervention
 */
class Purpose extends Enum {
  // Drainage
  static RECUPERATION = 'recuperation';

  static TRANSFER = 'transfer';

  // Filling
  static FILLING_AFTER_TRANSFER = 'filling_after_transfer';

  static RETROFIT = 'retrofit';

  static MAINTENANCE_LOAD = 'maintenance_load';

  static COMMISSIONING = 'commissioning';

  // Leak
  static CONTROL_PERIODIC = 'control_periodic';

  static CONTROL_NON_PERIODIC = 'control_non_periodic';

  // Assembly
  static ASSEMBLY = 'assembly';

  // Disassembly
  static DISASSEMBLY = 'disassembly';

  // Coolant drainage
  static COOLANT_DRAINAGE = 'coolant_drainage';

  static values = [
    Purpose.RECUPERATION,
    Purpose.TRANSFER,
    Purpose.FILLING_AFTER_TRANSFER,
    Purpose.RETROFIT,
    Purpose.MAINTENANCE_LOAD,
    Purpose.COMMISSIONING,
    Purpose.CONTROL_PERIODIC,
    Purpose.CONTROL_NON_PERIODIC,
    Purpose.ASSEMBLY,
    Purpose.DISASSEMBLY,
    Purpose.COOLANT_DRAINAGE,
  ];

  static readables = {
    [Purpose.RECUPERATION]: 'enum:intervention:purpose:recuperation',
    [Purpose.TRANSFER]: 'enum:intervention:purpose:transfer',
    [Purpose.FILLING_AFTER_TRANSFER]: 'enum:intervention:purpose:filling_after_transfer',
    [Purpose.RETROFIT]: 'enum:intervention:purpose:retrofit',
    [Purpose.MAINTENANCE_LOAD]: 'enum:intervention:purpose:maintenance_load',
    [Purpose.COMMISSIONING]: 'enum:intervention:purpose:commissioning',
    [Purpose.CONTROL_PERIODIC]: 'enum:intervention:purpose:control_periodic',
    [Purpose.CONTROL_NON_PERIODIC]: 'enum:intervention:purpose:control_non_periodic',
    [Purpose.ASSEMBLY]: 'enum:intervention_type:assembly',
    [Purpose.DISASSEMBLY]: 'enum:intervention_type:disassembly',
    [Purpose.COOLANT_DRAINAGE]: 'enum:intervention_type:coolant_drainage',
  };

  static PURPOSES_PER_INTERVENTION_TYPE = {
    [InterventionType.DRAINAGE]: [Purpose.RECUPERATION, Purpose.TRANSFER],
    [InterventionType.FILLING]: [
      Purpose.COMMISSIONING,
      Purpose.MAINTENANCE_LOAD,
      Purpose.FILLING_AFTER_TRANSFER,
      Purpose.RETROFIT,
    ],
    [InterventionType.LEAK]: [Purpose.CONTROL_PERIODIC, Purpose.CONTROL_NON_PERIODIC],
    [InterventionType.LEAK_REPAIR]: [Purpose.CONTROL_NON_PERIODIC],
    [InterventionType.ASSEMBLY]: [Purpose.ASSEMBLY],
    [InterventionType.DISASSEMBLY]: [Purpose.DISASSEMBLY],
    [InterventionType.COOLANT_DRAINAGE]: [Purpose.COOLANT_DRAINAGE],
  };

  /**
   * @return {String[]} The valid purposes for articles availability.
   */
  static getArticleAvailabilityPurposesValues() {
    return [
      // Either filling or transfer purposes:
      ...Purpose.PURPOSES_PER_INTERVENTION_TYPE[InterventionType.DRAINAGE],
      ...Purpose.PURPOSES_PER_INTERVENTION_TYPE[InterventionType.FILLING],
    ];
  }

  /**
   * @param {String} interventionType One of the available InterventionType values
   *
   * @return {String[]} Purpose values for given intervention type
   */
  static getPurposesForInterventionType(interventionType) {
    if (!Purpose.PURPOSES_PER_INTERVENTION_TYPE[interventionType]) {
      throw new Error(`Unsupported intervention of type "${interventionType}"`);
    }

    return Purpose.PURPOSES_PER_INTERVENTION_TYPE[interventionType];
  }
}

export default Purpose;
