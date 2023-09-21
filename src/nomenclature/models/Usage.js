import Enum from '../../common/models/Enum';
import Purpose from 'k2/app/modules/intervention/models/Purpose';

export default class Usage extends Enum {
  static FILLING = 'FILLING';
  static TRANSFER = 'TRANSFER';
  static DRAINAGE = 'DRAINAGE';

  static values = [Usage.FILLING, Usage.TRANSFER, Usage.DRAINAGE];

  static readables = {
    [Usage.FILLING]: 'enum:usage:filling',
    [Usage.TRANSFER]: 'enum:usage:transfer',
    [Usage.DRAINAGE]: 'enum:usage:drainage',
  };

  /**
   * "Indispos par usage".
   *
   * True unavailability means blocking.
   */
  static UNAVAILABILITIES = {
    [Usage.FILLING]: {
      [Purpose.RECUPERATION]: true,
      [Purpose.TRANSFER]: true,
    },
    [Usage.DRAINAGE]: {
      // Filling purposes
      [Purpose.FILLING_AFTER_TRANSFER]: false,
      [Purpose.RETROFIT]: false,
      [Purpose.MAINTENANCE_LOAD]: false,
      [Purpose.COMMISSIONING]: false,
      // Drainage purposes
      [Purpose.TRANSFER]: false,
    },
    [Usage.TRANSFER]: {
      // Filling purposes
      [Purpose.RETROFIT]: false,
      [Purpose.MAINTENANCE_LOAD]: false,
      [Purpose.COMMISSIONING]: false,
      // Drainage purposes
      [Purpose.RECUPERATION]: false,
    },
  };
}
