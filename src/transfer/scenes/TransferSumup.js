import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { confirm } from 'k2/app/modules/transfer/actions/transferActions';
import Container from 'k2/app/modules/container/models/Container';
import Button from 'k2/app/modules/common/components/form/Button';
import TransitionModal from 'k2/app/modules/common/components/modal/TransitionModal';
import I18n from 'i18n-js';
import { Image } from 'react-native';
import checkImage from 'k2/app/assets/icons/check.png';
import { backToDashboard } from 'k2/app/navigation';
import ContainerDetails from 'k2/app/modules/container/components/ContainerDetails';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import Definition from 'k2/app/modules/common/components/Definition';

class TransferSumup extends Component {
  static propTypes = {
    transfer: PropTypes.shape({
      source: PropTypes.instanceOf(Container).isRequired,
      target: PropTypes.instanceOf(Container).isRequired,
      load: PropTypes.number.isRequired,
    }).isRequired,
    confirmTransfer: PropTypes.func.isRequired,
  };

  static styles = {
    confirm: {
      marginTop: 10,
    },
  };

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.onConfirmModalClosed = this.onConfirmModalClosed.bind(this);

    this.state = {
      showConfirmModal: false,
    };
  }

  onSubmit() {
    this.props.confirmTransfer();

    this.setState({ showConfirmModal: true });
  }

  onConfirmModalClosed() {
    backToDashboard();
  }

  render() {
    const { transfer } = this.props;
    const { source, target, load } = transfer;
    const { showConfirmModal } = this.state;
    const { styles } = this.constructor;

    return (
      <WrapperView scrollable title={I18n.t('scenes.transfer.sum_up.title')}>
        <ContainerDetails container={source}>
          <Definition
            key="source_load"
            label={I18n.t('scenes.transfer.sum_up.container_detail.final_load:title')}
            value={`${Math.max(source.getCurrentLoad() - load, 0)}kg`}
          />
        </ContainerDetails>

        <ContainerDetails container={target}>
          <Definition
            key="target_load"
            label={I18n.t('scenes.transfer.sum_up.container_detail.final_load:title')}
            value={`${target.getCurrentLoad(true) + load}kg`}
          />
        </ContainerDetails>

        <Button onPress={this.onSubmit} style={styles.confirm}>
          {I18n.t('scenes.transfer.sum_up.submit')}
        </Button>

        <TransitionModal
          onClose={this.onConfirmModalClosed}
          visible={showConfirmModal}
          title={I18n.t('scenes.transfer.sum_up.confirm_modal.title')}
          subtitle={I18n.t('scenes.transfer.sum_up.confirm_modal.subtitle')}
          icon={<Image style={styles.iconConfirm} source={checkImage} />}
        />
      </WrapperView>
    );
  }
}

export default connect(
  state => ({
    transfer: state.transferReducer,
  }),
  dispatch => ({
    confirmTransfer: () => dispatch(confirm()),
  }),
)(TransferSumup);
