import Enum from '../../common/models/Enum';
import {
  iconBottleOut,
  iconBottleIn,
  iconLeakSearch,
  iconLeakRepair,
  iconAnalysis,
  iconCoolantDrainage,
} from '../../../assets/icons';

/**
 * Available InterventionTypes
 */
class InterventionType extends Enum {
  static DRAINAGE = 'drainage';

  static FILLING = 'filling';

  static LEAK = 'leak';

  static LEAK_REPAIR = 'leak_repair';

  static ASSEMBLY = 'assembly';

  static DISASSEMBLY = 'disassembly';

  static ANALYSIS = 'analysis';

  static COOLANT_DRAINAGE = 'coolant_drainage';

  static values = [
    InterventionType.DRAINAGE,
    InterventionType.FILLING,
    InterventionType.LEAK,
    InterventionType.LEAK_REPAIR,
    InterventionType.ASSEMBLY,
    InterventionType.DISASSEMBLY,
    InterventionType.ANALYSIS,
    InterventionType.COOLANT_DRAINAGE,
  ];

  static readables = {
    [InterventionType.DRAINAGE]: 'enum:intervention_type:drainage',
    [InterventionType.FILLING]: 'enum:intervention_type:filling',
    [InterventionType.LEAK]: 'enum:intervention_type:leak',
    [InterventionType.LEAK_REPAIR]: 'enum:intervention_type:leak_repair',
    [InterventionType.ASSEMBLY]: 'enum:intervention_type:assembly',
    [InterventionType.DISASSEMBLY]: 'enum:intervention_type:disassembly',
    [InterventionType.ANALYSIS]: 'enum:intervention_type:analysis',
    [InterventionType.COOLANT_DRAINAGE]: 'enum:intervention_type:coolant_drainage',
  };

  static icons = {
    [InterventionType.DRAINAGE]: iconBottleIn,
    [InterventionType.FILLING]: iconBottleOut,
    [InterventionType.LEAK]: iconLeakSearch,
    [InterventionType.LEAK_REPAIR]: iconLeakRepair,
    [InterventionType.ASSEMBLY]: iconLeakRepair,
    [InterventionType.DISASSEMBLY]: iconLeakRepair,
    [InterventionType.ANALYSIS]: iconAnalysis,
    [InterventionType.COOLANT_DRAINAGE]: iconCoolantDrainage,
  };
}

export default InterventionType;
