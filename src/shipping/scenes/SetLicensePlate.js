import I18n from 'i18n-js';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WrapperView from '../../common/components/WrapperView';
import { Button, TextInput } from '../../common/components/form';
import { GUTTER } from '../../common/styles/vars';
import { useDispatch } from 'react-redux';
import { setCarrierLicensePlate } from '../actions/shippingPipe';

const styles = {
  validate: {
    marginVertical: GUTTER,
  },
};

function SetLicensePlate({ next }) {
  const dispatch = useDispatch();
  const [licensePlate, setLicensePlate] = useState('');

  function onValidate() {
    if (!licensePlate) {
      return;
    }

    dispatch(setCarrierLicensePlate(licensePlate));
    next();
  }

  return (
    <WrapperView scrollable title={I18n.t('scenes.shipping.set_license_plate.title')}>
      <TextInput
        title={I18n.t('scenes.shipping.set_license_plate.label')}
        placeholder={''}
        onChangeText={val => setLicensePlate(val)}
        value={licensePlate}
      />
      <Button onPress={onValidate} valid={!!licensePlate} style={styles.validate}>
        {I18n.t('common.submit')}
      </Button>
    </WrapperView>
  );
}

SetLicensePlate.propTypes = {
  next: PropTypes.func.isRequired,
};

export default connect((state, props) => ({
  next: props.navigation.getParam('next'),
}))(SetLicensePlate);
