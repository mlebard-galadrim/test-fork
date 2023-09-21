/**
 * Describe the behaviour of a Pipe
 */
class AbstractPipe {
  /**
   * Get the step corresponding to the current state
   *
   * @param {Object} state
   * @param {Function} dispatch
   *
   * @return {String|Array} Step name or array of step name and navigation props.
   */
  getStep(state, dispatch) {
    throw new Error('A Pipe must implement the "getStep" method.');
  }
}

export default AbstractPipe;
