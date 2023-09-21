import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import Scan from 'k2/app/modules/common/components/Scan';
import { selectKit } from '../actions/selectKitPipe';

const ScanKit = ({ isFocused, next, selectKitAction }) => {
  const onCode = barcode => {
    if (barcode) {
      selectKitAction(barcode);
      next();
    }
  };

  return <Scan onCode={onCode} active={isFocused} />;
};

ScanKit.propTypes = {
  isFocused: PropTypes.bool.isRequired,
  next: PropTypes.func.isRequired,
  selectKitAction: PropTypes.func.isRequired,
};

export default connect(
  (state, props) => ({
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    selectKitAction: barcode => {
      dispatch(selectKit(barcode));
    },
  }),
)(withNavigationFocus(ScanKit));
