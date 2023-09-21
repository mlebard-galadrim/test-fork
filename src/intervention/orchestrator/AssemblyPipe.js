import AbstractPipe from '../../common/orchestrator/AbstractPipe';
import { PIPE_ASSEMBLY_SUMUP } from '../constants';

class AssemblyPipe extends AbstractPipe {
  /**
   * {@inheritDoc}
   */
  getStep(state) {
    return PIPE_ASSEMBLY_SUMUP;
  }
}

export default AssemblyPipe;
