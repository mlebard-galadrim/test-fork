import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import { View } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import InviteScan from 'k2/app/modules/common/components/InviteScan';
import { Button } from 'k2/app/modules/common/components/form';
import Detector from '../models/Detector';
import { confirmDetectorSelection, cancelDetectorSelection, getLastDetector } from '../actions/selectDetectorPipe';
import { PIPE_SCAN_DETECTOR, PIPE_FIND_DETECTOR_FORM } from '../constants';

/**
 * Invite Scan Detector scene
 */
class InviteScanDetector extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    confirmDetectorSelection: PropTypes.func.isRequired,
    cancelDetectorSelection: PropTypes.func.isRequired,
    getLastDetector: PropTypes.func.isRequired,
    lastDetector: PropTypes.instanceOf(Detector),
  };

  static defaultProps = {
    lastDetector: null,
  };

  static styles = {
    lastDetector: {
      view: {
        padding: 10,
        backgroundColor: '#eee',
      },
      title: {
        textAlign: 'center',
        marginBottom: 5,
      },
      designation: {
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 5,
      },
      expiresAt: {
        fontSize: 11,
        textAlign: 'center',
        marginTop: 5,
      },
    },
  };

  constructor() {
    super();

    this.validator = get('validator');
    this.analytics = get('firebase-analytics');
    this.onMissingCode = this.onMissingCode.bind(this);
    this.onScanCode = this.onScanCode.bind(this);
    this.selectLastDetector = this.selectLastDetector.bind(this);
    this.renderLastDetector = this.renderLastDetector.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  componentDidMount() {
    this.props.getLastDetector();
    //this.props.next(); // ??
  }

  /**
   * {@inheritdoc}
   */
  componentWillUnmount() {
    this.props.cancelDetectorSelection();
  }

  /**
   * onMissingCode callback
   */
  onMissingCode() {
    const { next } = this.props;

    this.analytics.logEvent('detector_search');

    navigate(PIPE_FIND_DETECTOR_FORM, { next });
  }

  /**
   * onScanCode callback
   */
  onScanCode() {
    const { next } = this.props;

    this.analytics.logEvent('detector_scan');

    navigate(PIPE_SCAN_DETECTOR, { next });
  }

  /**
   * Select last used detector
   */
  selectLastDetector() {
    const { lastDetector, next } = this.props;

    this.validator.validate(this.validator.isDetectorValid(lastDetector), () => {
      this.analytics.logEvent('detector_previous');
      this.props.confirmDetectorSelection(lastDetector);
      next();
    });
  }

  /**
   * Render last used detector
   *
   * @return {View|null}
   */
  renderLastDetector() {
    const { styles } = this.constructor;
    const { lastDetector } = this.props;

    if (!lastDetector || lastDetector.expired) {
      return null;
    }

    const date = I18n.l('date.formats.short', lastDetector.expiresAt);

    return (
      <View style={styles.lastDetector.view}>
        <Text style={styles.lastDetector.title}>{I18n.t('scenes.detector.invite_scan.last_detector:title')}</Text>
        <Text style={styles.lastDetector.designation}>
          {lastDetector.designation || lastDetector.barcode || lastDetector.serialNumber}
        </Text>
        <Button onPress={this.selectLastDetector}>
          {I18n.t('scenes.detector.invite_scan.last_detector:select_btn')}
        </Button>
        <Text style={styles.lastDetector.expiresAt}>
          {I18n.t('scenes.detector.invite_scan.last_detector:expires_at', {
            date,
          })}
        </Text>
      </View>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    return (
      <InviteScan
        title={I18n.t('scenes.detector.invite_scan.title')}
        onMissingCode={this.onMissingCode}
        onScanCode={this.onScanCode}
      >
        {this.renderLastDetector()}
      </InviteScan>
    );
  }
}

export default connect(
  (state, props) => ({
    lastDetector: state.selectDetectorPipe.lastDetector,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    confirmDetectorSelection: detector => dispatch(confirmDetectorSelection(detector)),
    cancelDetectorSelection: () => dispatch(cancelDetectorSelection()),
    getLastDetector: () => dispatch(getLastDetector()),
  }),
)(InviteScanDetector);
