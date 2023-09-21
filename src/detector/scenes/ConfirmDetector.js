import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import { Button } from 'k2/app/modules/common/components/form';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import Definition from 'k2/app/modules/common/components/Definition';
import ErrorMessage from 'k2/app/modules/common/components/ErrorMessage';
import Detector from '../models/Detector';
import { confirmDetectorSelection, cancelDetectorSelection } from '../actions/selectDetectorPipe';

/**
 * Confirm detector screen
 */
class ConfirmDetector extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    confirmDetectorSelection: PropTypes.func.isRequired,
    cancelDetectorSelection: PropTypes.func.isRequired,
    detector: PropTypes.instanceOf(Detector),
  };

  static defaultProps = {
    detector: null,
  };

  static styles = {
    confirm: {
      marginTop: 15,
    },
  };

  constructor() {
    super();

    this.validator = get('validator');

    this.confirm = this.confirm.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.detector !== null;
  }

  componentWillUnmount() {
    this.props.cancelDetectorSelection();
  }

  /**
   * Dispatch the detector to the current intervention store
   */
  confirm() {
    const { detector, next } = this.props;

    this.validator.validate(this.validator.isDetectorValid(detector), () => {
      this.props.confirmDetectorSelection(detector);
      next();
    });
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { designation, barcode, serialNumber, expiresAt, expired } = this.props.detector;

    return (
      <WrapperView title={I18n.t('scenes.detector.confirm_detector.title')}>
        <Definition
          label={I18n.t('scenes.detector.confirm_detector.designation')}
          value={designation || I18n.t('common.unknown')}
        />
        <Definition
          label={I18n.t('scenes.detector.confirm_detector.barcode')}
          value={barcode || I18n.t('common.unknown')}
        />
        <Definition label={I18n.t('scenes.detector.confirm_detector.serialNumber')} value={serialNumber} />
        <Definition
          label={I18n.t('scenes.detector.confirm_detector.expiresAt')}
          value={I18n.l('date.formats.short', expiresAt)}
        />
        {ErrorMessage.create(expired ? I18n.t('scenes.detector.confirm_detector.expired') : null, true)}
        <Button style={styles.confirm} onPress={this.confirm}>
          {I18n.t('common.confirm')}
        </Button>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    detector: state.selectDetectorPipe.detector,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    confirmDetectorSelection: detector => dispatch(confirmDetectorSelection(detector)),
    cancelDetectorSelection: () => dispatch(cancelDetectorSelection()),
  }),
)(ConfirmDetector);
