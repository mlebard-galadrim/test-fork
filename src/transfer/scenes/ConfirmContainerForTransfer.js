import I18n from 'i18n-js';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ContainerDetails from 'k2/app/modules/container/components/ContainerDetails';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import Button from 'k2/app/modules/common/components/form/Button';
import Container from 'k2/app/modules/container/models/Container';

ConfirmContainerForTransfer.propTypes = {
  container: PropTypes.instanceOf(Container),
  confirm: PropTypes.func.isRequired,
  confirmTitle: PropTypes.string.isRequired,
};

ConfirmContainerForTransfer.styles = {
  confirm: {
    marginTop: 10,
  },
};

function ConfirmContainerForTransfer(props) {
  const { styles } = ConfirmContainerForTransfer;
  const { container, confirmTitle, confirm } = props;

  return (
    <WrapperView scrollable title={confirmTitle}>
      <ContainerDetails container={container} />

      <Button style={styles.confirm} onPress={() => confirm(container)}>
        {I18n.t('common.confirm')}
      </Button>
    </WrapperView>
  );
}

export default connect((state, props) => ({
  container: props.navigation.getParam('container'),
  confirm: props.navigation.getParam('confirm', null),
  confirmTitle: props.navigation.getParam('confirmTitle', null),
}))(ConfirmContainerForTransfer);
