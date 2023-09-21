import I18n from 'i18n-js';
import React, { useState, useMemo } from 'react';
import PropTypes, { string } from 'prop-types';
import { connect } from 'react-redux';
import Text from 'k2/app/modules/common/components/Text';
import WrapperView from '../../common/components/WrapperView';
import { Button } from '../../common/components/form';
import { GUTTER } from '../../common/styles/vars';
import Definition from '../../common/components/Definition';
import Select from 'k2/app/modules/common/components/form/Select';
import { get } from 'k2/app/container';
import { backToDashboard } from 'k2/app/navigation';
import Component from '../../installation/models/Component';
import { saveAnalysis } from '../actions/oilAnalysisActions';
import { KitProp } from '../repositories/KitRepository';
import TransitionModal from '../../common/components/modal/TransitionModal';
import checkImage from '../../../assets/icons/check.png';
import { Image } from 'react-native';

const styles = {
  validate: {
    marginVertical: GUTTER,
  },
  iconConfirm: {
    width: 226 / 2,
    height: 226 / 2,
  },
};

/**
 * Use Kit Form scene
 */
function UseKitForm({ analysisNature, kit, barcode, compressor, saveAnalysisAction, uuid }) {
  const analysisTypeRepository = get('analysis_type_repository');
  const [analysisType, setAnalysisType] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const onValidate = () => {
    saveAnalysisAction(compressor, analysisType.uuid, kit, uuid);
    setShowModal(true);
    // backToDashboard();
  };

  const analysisTypeOptions = useMemo(
    () => Array.from(analysisTypeRepository.findAllOfNature(analysisNature)),
    [analysisNature, analysisTypeRepository],
  );

  const onTerminate = () => {
    backToDashboard();
  };

  return (
    <WrapperView scrollable title={I18n.t('scenes.analysis.use_kit_form.title')}>
      <Definition value={barcode} label={I18n.t('scenes.analysis.use_kit_form.barcode:label')} />

      <Select
        title={I18n.t('scenes.analysis.use_kit_form.type:title')}
        placeholder={I18n.t('scenes.analysis.use_kit_form.type:label')}
        clearLabel={I18n.t('scenes.analysis.use_kit_form.type:label')}
        value={analysisType}
        options={analysisTypeOptions}
        renderOption={value => value.designation.toString()}
        onPressOption={analysisType => setAnalysisType(analysisType)}
      />

      {analysisType ? <Text>{analysisType.explanation.toString()}</Text> : null}
      <Button onPress={onValidate} valid={Boolean(analysisType)} style={styles.validate}>
        {I18n.t('common.submit')}
      </Button>
      <TransitionModal
        onClose={onTerminate}
        visible={showModal}
        title={I18n.t('scenes.intervention.sum_up_validation.title.analysis')}
        subtitle={I18n.t('scenes.intervention.sum_up_validation.subtitle')}
        icon={<Image style={styles.iconConfirm} source={checkImage} />}
      />
    </WrapperView>
  );
}

UseKitForm.propTypes = {
  kit: KitProp.isRequired,
  barcode: PropTypes.string.isRequired,
  compressor: PropTypes.instanceOf(Component).isRequired,
  saveAnalysisAction: PropTypes.func.isRequired,
  uuid: string,
};

export default connect(
  state => ({
    analysisNature: state.analysisPipe.analysis,
    kit: state.analysisPipe.kit,
    barcode: state.analysisPipe.barcode,
    compressor: state.installationManagementReducer.component,
    uuid: state.analysisPipe.uuid,
  }),
  dispatch => ({
    saveAnalysisAction: (component, analysisType, kit, uuid) =>
      dispatch(saveAnalysis(component, analysisType, kit, uuid)),
  }),
)(UseKitForm);
