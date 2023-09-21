import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';
import { connect, useDispatch } from 'react-redux';
import { get } from 'k2/app/container';
import { saveIntervention, setPurpose } from '../actions/interventionPipe';
import Purpose from '../models/Purpose';
import checkImage from '../../../assets/icons/check.png';
import InterventionTransitionModal from '../components/InterventionTransitionModal';
import I18n from 'i18n-js';

function CoolantDrainageTransition({ intervention, installation }) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const dispatch = useDispatch();
  const styles = CoolantDrainageTransition.styles;

  useEffect(() => {
    dispatch(setPurpose(Purpose.COOLANT_DRAINAGE));
    dispatch(saveIntervention());
    setShowConfirmModal(true);
  }, [dispatch, setShowConfirmModal]);
  return (
    <InterventionTransitionModal
      visible={showConfirmModal}
      title={I18n.t(`scenes.intervention.sum_up_validation.title.${intervention.type}`)}
      subtitle={I18n.t('scenes.intervention.sum_up_validation.subtitle')}
      icon={<Image style={styles.iconConfirm} source={checkImage} />}
      site={installation.site}
      intervention={intervention}
    />
  );
}

CoolantDrainageTransition.styles = {
  iconConfirm: {
    width: 226 / 2,
    height: 226 / 2,
  },
};

export default connect(state => {
  const { intervention } = state.interventionPipe;
  const installation = get('installation_repository').find(intervention.installation);

  return {
    installation,
    intervention,
  };
})(CoolantDrainageTransition);
