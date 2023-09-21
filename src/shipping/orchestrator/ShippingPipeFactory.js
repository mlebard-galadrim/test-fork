import AbstractPipeFactory from '../../common/orchestrator/AbstractPipeFactory';

class ShippingPipeFactory extends AbstractPipeFactory {
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
  getPipe(state) {
    const { type } = state.shippingReducer;

    return this.container.get(`shipping_${type.value}_pipe`);
  }
}

export default ShippingPipeFactory;
