import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WrapperView from '../../common/components/WrapperView';
import { TextInput, DatePicker, Button } from '../../common/components/form';
import { createDetector } from '../actions/selectDetectorPipe';
import Detector from '../models/Detector';

class CreateDetectorForm extends Component {
  static propTypes = {
    barcode: PropTypes.string.isRequired,
    createDetector: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      designation: null,
      serialNumber: null,
      lastInspectionDate: new Date(),
      mark: null,
      barcode: props.barcode,
      errorDesignation: null,
      errorSerialNumber: null,
      errorInspectionDate: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.isFormValid = this.isFormValid.bind(this);
    this.setDesignation = this.setDesignation.bind(this);
    this.setSerialNumber = this.setSerialNumber.bind(this);
    this.setInspectionDate = this.setInspectionDate.bind(this);
    this.setMark = this.setMark.bind(this);
    this.setBarcode = this.setBarcode.bind(this);
  }

  /**
   * Submit form
   */
  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    const { designation, serialNumber, lastInspectionDate, mark, barcode } = this.state;
    const detector = {
      designation,
      serialNumber,
      lastInspectionDate,
      mark,
      barcode,
    };

    this.props.createDetector(detector);
    this.props.next();
  }

  /**
   * @param {String} designation
   */
  setDesignation(designation) {
    this.setState({
      designation,
      errorDesignation: !designation.length,
    });
  }

  /**
   * @param {String} serialNumber
   */
  setSerialNumber(serialNumber) {
    this.setState({
      serialNumber,
      errorSerialNumber: !serialNumber.length,
    });
  }

  /**
   * @param {Date} lastInspectionDate
   */
  setInspectionDate(lastInspectionDate) {
    const now = new Date();

    this.setState({
      lastInspectionDate,
      errorInspectionDate: Detector.hasExpired(lastInspectionDate) || lastInspectionDate > now,
    });
  }

  /**
   * @param {String} mark
   */
  setMark(mark) {
    this.setState({ mark });
  }

  /**
   * @param {String} barcode
   */
  setBarcode(barcode) {
    this.setState({ barcode });
  }

  /**
   * Is form valid?
   *
   * @return {Boolean}
   */
  isFormValid() {
    const { designation, serialNumber, lastInspectionDate, errorDesignation, errorSerialNumber, errorInspectionDate } =
      this.state;

    return (
      designation !== null &&
      serialNumber !== null &&
      lastInspectionDate !== null &&
      !errorDesignation &&
      !errorSerialNumber &&
      !errorInspectionDate
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const {
      designation,
      serialNumber,
      lastInspectionDate,
      mark,
      barcode,
      errorDesignation,
      errorSerialNumber,
      errorInspectionDate,
    } = this.state;

    return (
      <WrapperView scrollable keyboardAware full title={I18n.t('scenes.detector.create_detector_form.title')}>
        <TextInput
          title={I18n.t('scenes.detector.create_detector_form.designation:label')}
          defaultValue={designation}
          onChangeText={this.setDesignation}
          error={errorDesignation ? I18n.t('common.form.input_not_empty') : null}
        />
        <TextInput
          title={I18n.t('scenes.detector.create_detector_form.serial_number:label')}
          defaultValue={serialNumber}
          onChangeText={this.setSerialNumber}
          error={errorSerialNumber ? I18n.t('common.form.input_not_empty') : null}
        />
        <DatePicker
          title={I18n.t('scenes.detector.create_detector_form.last_inspection_date:label')}
          date={lastInspectionDate}
          onChange={this.setInspectionDate}
          error={errorInspectionDate ? I18n.t('scenes.detector.create_detector_form.last_inspection_date:error') : null}
        />
        <TextInput
          title={I18n.t('scenes.detector.create_detector_form.mark:label')}
          defaultValue={mark}
          onChangeText={this.setMark}
          optional
        />
        <TextInput
          title={I18n.t('scenes.detector.create_detector_form.barcode:label')}
          defaultValue={barcode}
          onChangeText={this.setBarcode}
          optional
        />
        <Button valid={this.isFormValid()} onPress={this.onSubmit}>
          {I18n.t('common.submit')}
        </Button>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    barcode: props.navigation.getParam('barcode'),
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    createDetector: detector => dispatch(createDetector(detector)),
  }),
)(CreateDetectorForm);
