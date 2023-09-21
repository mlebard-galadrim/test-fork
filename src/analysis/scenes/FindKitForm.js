import I18n from 'i18n-js';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WrapperView from '../../common/components/WrapperView';
import { TextInput, Button } from '../../common/components/form';
import { GUTTER } from '../../common/styles/vars';
import { selectKit } from '../actions/selectKitPipe';
import { KitProp } from '../repositories/KitRepository';

const styles = {
  validate: {
    marginVertical: GUTTER,
  },
};

/**
 *
 * @param {import('../repositories/KitRepository').Kit} kit
 * @param {String} barcode
 * @param {String} barcodeState
 *
 * @return {String|null}
 */
const getErrorMessage = (kit, barcode, barcodeState) => {
  if (barcode === barcodeState) {
    if (!kit && barcode) {
      return I18n.t('scenes.analysis.find_kit_form.error:unknown_kit', {
        barcode,
      });
    }

    if (kit && kit.used) {
      return I18n.t('scenes.analysis.find_kit_form.error:used_kit', {
        barcode,
      });
    }
  }

  return null;
};

function FindKitForm({ next, kit, barcode: passedBarcode, selectKitAction }) {
  const [barcode, setBarcode] = useState(passedBarcode);

  function onValidate() {
    if (!barcode) {
      return;
    }

    selectKitAction(barcode);
    next();
  }

  return (
    <WrapperView scrollable title={I18n.t('scenes.analysis.find_kit_form.title')}>
      <TextInput
        title={I18n.t('scenes.analysis.find_kit_form.barcode:label')}
        placeholder={I18n.t('scenes.analysis.find_kit_form.barcode:placeholder')}
        onChangeText={setBarcode}
        defaultValue={barcode}
        error={getErrorMessage(kit, passedBarcode, barcode)}
      />
      <Button onPress={onValidate} valid={!!barcode} style={styles.validate}>
        {I18n.t('common.submit')}
      </Button>
    </WrapperView>
  );
}

FindKitForm.propTypes = {
  next: PropTypes.func.isRequired,
  selectKitAction: PropTypes.func.isRequired,
  kit: KitProp,
  barcode: PropTypes.string,
};

export default connect(
  (state, props) => ({
    kit: state.analysisPipe.kit,
    barcode: state.analysisPipe.barcode,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    selectKitAction: barcode => dispatch(selectKit(barcode)),
  }),
)(FindKitForm);
