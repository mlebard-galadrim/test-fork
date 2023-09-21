import I18n from 'i18n-js';
import React, { Component } from 'react';
import { Alert as RNAlert, Text, TextInput } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import Scan from 'k2/app/modules/common/components/Scan';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { get } from 'k2/app/container';
import { cancelArianeOperation, setArianeOperation } from 'k2/app/modules/shipping/actions/shippingPipe';
import Loader from 'k2/app/modules/common/components/Loader';
import View from 'k2/app/modules/common/components/View';
import Config from 'react-native-config';
import { margin } from 'k2/app/modules/common/styles/utils';
import { GUTTER } from 'k2/app/modules/common/styles/vars';
import * as Sentry from '@sentry/react-native';
import UnexpectedArianeOperationArticle from 'k2/app/modules/shipping/errors/UnexpectedArianeOperationArticle';
import { TimeoutError } from 'k2/app/modules/common/api/ApiClient';
import { back } from 'k2/app/navigation';

/**
 * Scan a document barcode and fetch related operation info by calling the Ariane API directly.
 * It requires a network connection.
 *
 * @property {ApiClient} api
 */
class ScanDocument extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    setArianeOperation: PropTypes.func.isRequired,
    onArianeOperationSet: PropTypes.func.isRequired,
    cancelArianeOperation: PropTypes.func.isRequired,
    /**
     * @see https://reactnavigation.org/docs/use-is-focused/#using-with-class-component
     */
    isFocused: PropTypes.bool.isRequired,
    devMode: PropTypes.bool,
    offline: PropTypes.bool,
  };

  static defaultProps = {
    devMode: false,
    onArianeOperationSet: () => {},
  };

  static styles = {
    head: {
      flex: 0,
      ...margin(GUTTER, 0),
      padding: GUTTER,
    },
    title: {
      textAlign: 'center',
      padding: GUTTER,
      color: 'white',
    },
    spinner: {
      paddingTop: GUTTER,
    },
    button: {
      flex: 1,
      borderRadius: 0,
      height: 42,
    },
    buttonText: {
      color: '#fff',
    },
    devInput: { backgroundColor: 'grey' },
  };

  constructor(props) {
    super(props);

    this.api = get('api');
    this.onCode = this.onCode.bind(this);
    this.onOperationFound = this.onOperationFound.bind(this);
    this.onOperationNotFound = this.onOperationNotFound.bind(this);

    this.state = {
      getOperationLoading: false,
      getOperationError: null,
      getOperationDetails: null,
    };
  }

  componentWillUnmount() {
    this.props.cancelArianeOperation();
  }

  /**
   * Catch the camera result on code detection
   *
   * @param {String} barcode
   */
  onCode(barcode) {
    this.setState({ getOperationLoading: true, getOperationError: null, getOperationDetails: null });
    this.api.getArianeOperation(
      barcode,
      ({ operation }) => this.onOperationFound(operation, barcode),
      errorContent => this.onOperationNotFound(errorContent, barcode),
    );
  }

  /**
   * @param {Object|Error} errorContent API error response content
   *                       or an Error instance if something went wrong during the call
   * @param {String}       barcode
   */
  onOperationNotFound(errorContent, barcode) {
    this.setState({ getOperationLoading: false, getOperationError: errorContent, getOperationDetails: false });

    const actions = [
      { text: 'OK', style: 'default' },
      { text: I18n.t('common.quit'), style: 'destructive', onPress: () => back() },
    ];

    if (errorContent.error && ScanDocumentErrors.values.includes(errorContent.error.code)) {
      RNAlert.alert(
        I18n.t('scenes.shipping.scan_document.get_operation_error.title'),
        I18n.t(`scenes.shipping.scan_document.get_operation_error.${errorContent.error.code}`),
        actions,
      );

      return;
    }

    if (errorContent instanceof TimeoutError) {
      RNAlert.alert(
        I18n.t('scenes.shipping.scan_document.get_operation_error.title'),
        I18n.t('scenes.shipping.scan_document.get_operation_error.timeout'),
        [
          { text: I18n.t('common.retry'), style: 'default', onPress: () => this.onCode(barcode) },
          { text: I18n.t('common.quit'), style: 'destructive', onPress: () => back() },
          { text: I18n.t('common.cancel'), style: 'cancel' },
        ],
      );

      return;
    }

    let error;

    if (errorContent instanceof Error) {
      // eslint-disable-next-line max-len
      errorContent.message = `Unexpected error while trying to find an Ariane operation through the API: ${errorContent.message}`;
      error = errorContent;
    } else {
      error = new Error(
        `Unexpected API response while trying to find an Ariane operation: ${JSON.stringify(errorContent)}`,
      );
    }

    Sentry.captureException(error);

    RNAlert.alert(
      I18n.t('scenes.shipping.scan_document.get_operation_error.title'),
      I18n.t('scenes.shipping.scan_document.get_operation_error.unexpectedError'),
      actions,
    );
  }

  onOperationFound(operation, barcode) {
    this.setState({ getOperationLoading: false, getOperationError: null, getOperationDetails: operation });

    this.props
      .setArianeOperation(operation, barcode)
      .then(args => {
        this.props.onArianeOperationSet(args);

        this.props.next();
      })
      .catch(e => {
        Sentry.captureException(e);
        console.error(e);
        let message = I18n.t('scenes.shipping.scan_document.get_operation_error.unexpectedError');

        if (e instanceof UnexpectedArianeOperationArticle) {
          message = I18n.t('scenes.shipping.scan_document.get_operation_error.unexpectedArticle');
        }

        RNAlert.alert(I18n.t('scenes.shipping.scan_document.get_operation_error.title'), message);
      })
      .done();
  }

  renderDevMode() {
    const { styles } = this.constructor;
    const { devMode } = this.props;

    return (
      devMode && (
        <TextInput
          autoFocus={true}
          style={styles.devInput}
          onEndEditing={e => this.onCode(e.nativeEvent.text)}
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Enter barcode in dev mode"
          clearButtonMode="while-editing"
        />
      )
    );
  }

  /**
   * @inheritdoc
   */
  render() {
    const { styles } = this.constructor;
    const { isFocused, offline } = this.props;
    const { getOperationLoading } = this.state;

    if (offline) {
      return (
        <WrapperView full>
          <Text>{I18n.t('scenes.shipping.scan_document.no_connection')}</Text>
        </WrapperView>
      );
    }

    return (
      <WrapperView full>
        <Scan onCode={this.onCode} active={isFocused}>
          <View style={styles.head}>
            {getOperationLoading ? (
              [
                <Text style={styles.title} key={'title'}>
                  {I18n.t('scenes.shipping.scan_document.get_operation_loading')}
                </Text>,
                <Loader style={styles.spinner} key="loader" />,
              ]
            ) : (
              <Text style={styles.title}>{I18n.t('scenes.shipping.scan_document.title')}</Text>
            )}
          </View>
          {this.renderDevMode()}
        </Scan>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    offline: state.device.offline,
    next: props.navigation.getParam('next'),
    onArianeOperationSet: props.navigation.getParam('onArianeOperationSet') || (() => {}),
    devMode: Config.APP_ENV === 'development',
  }),
  dispatch => ({
    setArianeOperation: (operation, details) => dispatch(setArianeOperation(operation, details)),
    cancelArianeOperation: () => dispatch(cancelArianeOperation()),
  }),
)(withNavigationFocus(ScanDocument));

class ScanDocumentErrors {
  static ERROR_INVALID_TOKEN = 'invalidToken';
  static ERROR_NOT_FOUND = 'operationInexistent';
  static ERROR_UNKNOWN_COMPANY = 'unknownCompany';
  static ERROR_UNKNOWN_COMPANY_CONTEXT = 'unknownCompanyContext';
  static ERROR_INVALID_COMPANY_CONTEXT = 'invalidCompanyContext';
  static ERROR_INVALID_BARCODE_FORMAT = 'invalidBarcodeFormat';
  static ERROR_EMPTY_OPERATION = 'emptyOperation';

  static get values() {
    return Object.values(ScanDocumentErrors);
  }
}
