import AbstractPipeFactory from '../../common/orchestrator/AbstractPipeFactory';

class AnalysisPipeFactory extends AbstractPipeFactory {
  /**
   * @param {Container} container
   */
  constructor(container) {
    super();

    this.container = container;
  }

  /**
   * {@inheritDoc}
   */
  getPipe() {
    return this.container.get('oil_analysis_pipe');
  }
}

export default AnalysisPipeFactory;
