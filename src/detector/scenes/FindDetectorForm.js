import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { navigate } from 'k2/app/navigation';
import Text from 'k2/app/modules/common/components/Text';
import { selectDetector as selectDetectorAction } from '../actions/selectDetectorPipe';
import Detector from '../models/Detector';
import WrapperView from '../../common/components/WrapperView';
import { TextInput, Button } from '../../common/components/form';
import { COLOR_LIGHT_BG, GUTTER } from '../../common/styles/vars';
import { PIPE_CREATE_DETECTOR_FORM } from '../constants';

/**
 * Add Detector Form scene
 */
class FindDetectorForm extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    selectDetectorAction: PropTypes.func.isRequired,
    detector: PropTypes.instanceOf(Detector),
    barcode: PropTypes.string,
  };

  static defaultProps = {
    detector: null,
    barcode: null,
  };

  static styles = {
    unknownDetector: {
      wrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        margin: 20,
        padding: GUTTER,
        borderRadius: 10,
        backgroundColor: COLOR_LIGHT_BG,
      },
      text: {
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: GUTTER,
      },
    },
    validate: {
      marginVertical: GUTTER,
    },
    create: {
      textAlign: 'center',
      alignSelf: 'stretch',
    },
  };

  constructor(props) {
    super(props);

    const { barcode } = props;

    this.state = {
      barcode,
    };

    this.setBarcode = this.setBarcode.bind(this);
    this.onValidate = this.onValidate.bind(this);
    this.goToCreateDetector = this.goToCreateDetector.bind(this);
    this.getErrorMessage = this.getErrorMessage.bind(this);
  }

  /**
   * Validate detector selection
   */
  onValidate() {
    const { barcode } = this.state;

    if (!barcode) {
      return;
    }

    this.props.selectDetectorAction(barcode);
    this.props.next();
  }

  /**
   * Set the container barcode
   *
   * @param {String} barcode
   */
  setBarcode(barcode) {
    this.setState({ barcode });
  }

  /**
   * Error message
   *
   * @return {String|null}
   */
  getErrorMessage() {
    const { detector, barcode } = this.props;

    if (barcode === this.state.barcode) {
      if (!detector && barcode) {
        return I18n.t('scenes.detector.find_detector_form.error:unknown_detector', {
          barcode,
        });
      }

      if (detector && detector.expired) {
        return I18n.t('scenes.detector.find_detector_form.error:expired_detector', {
          barcode,
        });
      }
    }

    return null;
  }

  /**
   * Navigate to create detector scene
   */
  goToCreateDetector() {
    const { next, barcode } = this.props;

    navigate(PIPE_CREATE_DETECTOR_FORM, { barcode, next });
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = FindDetectorForm;
    const { detector, barcode } = this.props;
    const barcodeState = this.state.barcode;

    return (
      <WrapperView scrollable title={I18n.t('scenes.detector.find_detector_form.title')}>
        <TextInput
          title={I18n.t('scenes.detector.find_detector_form.barcode:label')}
          placeholder={I18n.t('scenes.detector.find_detector_form.barcode:placeholder')}
          onChangeText={this.setBarcode}
          defaultValue={barcodeState}
          error={this.getErrorMessage()}
        />
        <Button onPress={this.onValidate} valid={!!barcodeState} style={styles.validate}>
          {I18n.t('common.submit')}
        </Button>
        {!detector && barcode && barcode === this.state.barcode && (
          <View style={styles.unknownDetector.wrapper}>
            <Text style={styles.unknownDetector.text}>
              {I18n.t('scenes.detector.find_detector_form.create_unknown_detector:label')}
            </Text>
            <Button onPress={this.goToCreateDetector} style={styles.create}>
              {I18n.t('scenes.detector.find_detector_form.create_unknown_detector:button')}
            </Button>
          </View>
        )}
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    detector: state.selectDetectorPipe.detector,
    barcode: state.selectDetectorPipe.barcode,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    selectDetectorAction: barcode => dispatch(selectDetectorAction(barcode)),
  }),
)(FindDetectorForm);
