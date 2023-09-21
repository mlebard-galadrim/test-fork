import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import Scan from 'k2/app/modules/common/components/Scan';
import { selectDetector as selectDetectorAction } from '../actions/selectDetectorPipe';

class ScanDetector extends Component {
  static propTypes = {
    isFocused: PropTypes.bool.isRequired,
    next: PropTypes.func.isRequired,
    selectDetectorAction: PropTypes.func.isRequired,
  };

  constructor() {
    super();

    this.onCode = this.onCode.bind(this);
  }

  /**
   * Catch the camera result on code detection
   *
   * @param {String} barcode
   */
  onCode(barcode) {
    if (barcode) {
      this.props.selectDetectorAction(barcode);
      this.props.next();
    }
  }

  /**
   * {@inheritdoc}
   */
  render() {
    return <Scan onCode={this.onCode} active={this.props.isFocused} />;
  }
}

export default connect(
  (state, props) => ({
    next: props.navigation.getParam('next', null),
  }),
  dispatch => ({
    selectDetectorAction: barcode => dispatch(selectDetectorAction(barcode)),
  }),
)(withNavigationFocus(ScanDetector));
