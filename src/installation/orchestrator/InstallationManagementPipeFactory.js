import AbstractPipeFactory from '../../common/orchestrator/AbstractPipeFactory';

class InstallationManagementPipeFactory extends AbstractPipeFactory {
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
    return this.container.get('installation_management_pipe');
  }
}

export default InstallationManagementPipeFactory;
