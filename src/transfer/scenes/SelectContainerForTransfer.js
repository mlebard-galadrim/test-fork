import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Text from 'k2/app/modules/common/components/Text';
import InviteScanContainer from 'k2/app/modules/container/components/InviteScanContainer';
import { connect } from 'react-redux';
import { reset, selectSource, selectTarget } from 'k2/app/modules/transfer/actions/transferActions';
import { navigate } from 'k2/app/navigation';
import {
  PIPE_CONFIRM_CONTAINER,
  PIPE_TRANSFER_LOAD,
  PIPE_TRANSFER_SELECT_TARGET,
} from 'k2/app/modules/transfer/constants';
import { get } from 'k2/app/container';

/**
 * @property {Validator} validator
 */
class SelectContainerForTransfer extends Component {
  static propTypes = {
    selectContainer: PropTypes.func.isRequired,
    /** Next screen */
    next: PropTypes.string.isRequired,
    /**
     * ({Container} container, {Validator} validator) => [validation rules]
     **/
    validationRules: PropTypes.func.isRequired,
    onUnmount: PropTypes.func,
  };

  static defaultProps = {
    onUnmount: null,
  };

  static styles = {
    subtitle: {
      textAlign: 'center',
      color: '#fff',
    },
  };

  constructor(props) {
    super(props);

    this.validator = get('validator');

    this.onSelectedContainer = this.onSelectedContainer.bind(this);
  }

  componentWillUnmount() {
    this.props.onUnmount && this.props.onUnmount();
  }

  /**
   * @param {Container} selectedContainer
   */
  onSelectedContainer(selectedContainer) {
    const { validationRules, next, confirmTitle } = this.props;

    const select = container => {
      this.props.selectContainer(container);
      navigate(next, 'push');
    };

    const confirm = container => {
      this.validator.validate(
        validationRules(container, this.validator),
        () => select(container),
        () => {},
      );
    };

    navigate(PIPE_CONFIRM_CONTAINER, { container: selectedContainer, confirm, confirmTitle }, 'push');
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;

    return (
      <InviteScanContainer onSelectedContainer={this.onSelectedContainer} next={() => {}}>
        <Text styleName="subtitle" style={styles.subtitle}>
          {this.props.subtitle}
        </Text>
      </InviteScanContainer>
    );
  }
}

export const SelectSourceContainerForTransfer = connect(null, dispatch => ({
  selectSource: container => dispatch(selectSource(container)),
  resetTransfer: () => dispatch(reset()),
}))(function (props) {
  return (
    <SelectContainerForTransfer
      subtitle={I18n.t('scenes.transfer.select_source')}
      confirmTitle={I18n.t('scenes.transfer.confirm_selected_container.source')}
      // Clean the transfer reducer on quit
      onUnmount={props.resetTransfer}
      selectContainer={props.selectSource}
      next={PIPE_TRANSFER_SELECT_TARGET}
      validationRules={(container, validator) => [
        validator.isContainerAvailableForTransfer(container),
        validator.hasFluid(container),
      ]}
    />
  );
});

export const SelectTargetContainerForTransfer = connect(
  state => ({
    sourceContainer: state.transferReducer.source,
  }),
  dispatch => ({
    selectTarget: container => dispatch(selectTarget(container)),
  }),
)(function (props) {
  return (
    <SelectContainerForTransfer
      subtitle={I18n.t('scenes.transfer.select_target')}
      confirmTitle={I18n.t('scenes.transfer.confirm_selected_container.target')}
      selectContainer={props.selectTarget}
      next={PIPE_TRANSFER_LOAD}
      validationRules={(container, validator) => [
        validator.areDifferentContainers(props.sourceContainer, container),
        validator.areContainersFluidsMatching(props.sourceContainer, container),
      ]}
    />
  );
});
