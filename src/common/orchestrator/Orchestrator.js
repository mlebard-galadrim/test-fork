class Orchestrator {
  /**
   * @param {Store} store  The redux store handling the application state.
   * @param {AbstractPipeFactory} pipeFactory The available pipes for the orchestrator.
   */
  constructor(store, pipeFactory) {
    this.store = store;
    this.pipeFactory = pipeFactory;
  }

  /**
   * Get current step
   *
   * @return {Step} Step with name and navigation props.
   */
  getStep() {
    const state = this.store.getState();
    const pipe = this.pipeFactory.getPipe(state);

    if (!pipe) {
      return null;
    }

    let step = pipe.getStep(state, this.store.dispatch);

    if (!(step instanceof Step)) {
      step = typeof step === 'string' ? new Step(step) : new Step(...step);
    }

    return step;
  }
}

export class Step {
  constructor(name, props = {}) {
    this.name = name;
    this.props = props;
  }
}

export default Orchestrator;
