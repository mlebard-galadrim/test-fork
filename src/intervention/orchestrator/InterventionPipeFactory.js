import AbstractPipeFactory from '../../common/orchestrator/AbstractPipeFactory';

/**
 * Intervention pipe resolver
 */
class InterventionPipeFactory extends AbstractPipeFactory {
  /**
   * @param {Container} container
   */
  constructor(container) {
    super();

    this.container = container;
  }

  /**
   * Get the Pipe that correspond to the given state
   *
   * @param {Object} state
   *
   * @return {AbstractPipe}
   */
  getPipe(state) {
    const { intervention } = state.interventionPipe;

    if (!intervention) {
      return null;
    }

    return this.container.get(`intervention_pipe_${intervention.type}`);
  }
}

export default InterventionPipeFactory;
