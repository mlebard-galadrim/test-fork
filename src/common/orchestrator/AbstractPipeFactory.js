/**
 * Abstract Pipe Factory
 */
class AbstractPipeFactory {
  /**
   * Get the Pipe that correspond to the given state
   *
   * @param {Object} state
   *
   * @return {AbstractPipe}
   */
  getPipe(state) {
    throw new Error('A PipeFactory must implement the "getPipe" method.');
  }
}

export default AbstractPipeFactory;
