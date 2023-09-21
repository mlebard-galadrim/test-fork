import I18n from 'i18n-js';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WrapperView from '../../common/components/WrapperView';
import { Button, Select } from '../../common/components/form';
import { GUTTER } from '../../common/styles/vars';
import { useDispatch } from 'react-redux';
import AnalysisNature from '../models/AnalysisNature';
import { setAnalysisNature } from '../actions/oilAnalysisActions';
import { Text } from 'react-native';

const styles = {
  validate: {
    marginVertical: GUTTER,
  },
};

function SelectAnalysisNature({ next }) {
  const dispatch = useDispatch();
  const [nature, setNature] = useState(null);

  function onValidate() {
    if (!nature) {
      return;
    }

    dispatch(setAnalysisNature(nature));
    next();
  }

  const natureOptions = AnalysisNature.values;

  const styles = SelectAnalysisNature.styles;

  return (
    <WrapperView scrollable title={I18n.t('scenes.analysis.select_analysis_nature.title')}>
      <Select
        title={I18n.t('scenes.analysis.select_analysis_nature.nature:title')}
        placeholder={I18n.t('scenes.analysis.select_analysis_nature.nature:label')}
        clearLabel={I18n.t('scenes.analysis.select_analysis_nature.nature:label')}
        value={nature}
        options={natureOptions}
        renderOption={value => I18n.t(AnalysisNature.readableFor(value))}
        onPressOption={nature => setNature(nature)}
      />
      {/*TODO: remove bottom Text once more options are added*/}
      <Text style={styles.smallPadding}>{I18n.t('scenes.analysis.select_analysis_nature.more_options_soon')}</Text>
      <Button onPress={onValidate} valid={!!nature} style={styles.validate}>
        {I18n.t('common.submit')}
      </Button>
    </WrapperView>
  );
}

SelectAnalysisNature.propTypes = {
  next: PropTypes.func.isRequired,
};

SelectAnalysisNature.styles = {
  smallPadding: {
    paddingTop: 10,
  },
};

export default connect(
  (state, props) => ({
    next: props.navigation.getParam('next'),
  }),
  //   dispatch => ({
  //     selectKitAction: barcode => dispatch(selectKit(barcode)),
  //   }),
)(SelectAnalysisNature);
