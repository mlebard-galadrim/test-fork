import Enum from '../../common/models/Enum';
import { iconAnalysis } from '../../../assets/icons';

class AnalysisNature extends Enum {
  static OIL = 'oil';
  // static REFRIGERANT_FLUID = 'refrigerant_fluid';

  static values = [
    AnalysisNature.OIL,
    // AnalysisNature.REFRIGERANT_FLUID
  ];

  static readables = {
    [AnalysisNature.OIL]: 'enum:analysis_nature:oil',
    // [AnalysisNature.REFRIGERANT_FLUID]: 'enum:analysis_nature:refrigerant_fluid',
  };

  static icons = {
    [AnalysisNature.OIL]: iconAnalysis,
    // [AnalysisNature.REFRIGERANT_FLUID]: iconAnalysis,
  };
}

export default AnalysisNature;
