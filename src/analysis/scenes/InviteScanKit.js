import I18n from 'i18n-js';
import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import InviteScan from 'k2/app/modules/common/components/InviteScan';
import { ANALYSIS_FIND_KIT_FORM, ANALYSIS_SCAN_KIT } from '../constants';
import { cancelKitSelection } from '../actions/selectKitPipe';

/**
 * Invite Scan Kit scene
 */
function InviteScanKit({ next, cancelKitSelection }) {
  const analytics = useMemo(() => get('firebase-analytics'), []);

  const onMissingCode = () => {
    analytics.logEvent('kit_search');
    navigate(ANALYSIS_FIND_KIT_FORM, { next });
  };

  const onScanCode = () => {
    analytics.logEvent('kit_search');
    navigate(ANALYSIS_SCAN_KIT, { next });
  };

  useEffect(() => {
    return () => {
      cancelKitSelection();
    };
  }, [cancelKitSelection]);

  return (
    <InviteScan
      title={I18n.t('scenes.analysis.invite_scan.title')}
      onMissingCode={onMissingCode}
      onScanCode={onScanCode}
    />
  );
}

InviteScanKit.propTypes = {
  next: PropTypes.func.isRequired,
  cancelKitSelection: PropTypes.func.isRequired,
};

export default connect(
  (state, props) => ({
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    cancelKitSelection: () => dispatch(cancelKitSelection()),
  }),
)(InviteScanKit);
