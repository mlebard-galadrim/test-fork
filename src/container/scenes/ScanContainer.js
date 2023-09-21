import I18n from 'i18n-js';
import React, { Component } from 'react';
import { Text } from 'react-native';
import { Button } from 'k2/app/modules/common/components/form';
import View from 'k2/app/modules/common/components/View';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { navigate } from 'k2/app/navigation';
import Scan from 'k2/app/modules/common/components/Scan';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { PIPE_SELECT_CONTAINER, PIPE_CONTAINER_INFOS, PIPE_SEARCH_CONTAINER } from '../constants';

/**
 * ScanContainer
 */
class ScanContainer extends Component {
  static propTypes = {
    missingCode: PropTypes.bool,
    next: PropTypes.func,
    nextMethod: PropTypes.string,
    isFocused: PropTypes.bool.isRequired,
    onSelectedContainer: PropTypes.func,
  };

  static defaultProps = {
    missingCode: false,
    next: null,
    nextMethod: undefined,
    onSelectedContainer: () => {},
  };

  static styles = {
    button: {
      flex: 1,
      borderRadius: 0,
      height: 42,
    },
    buttonText: {
      color: '#fff',
    },
  };

  constructor() {
    super();

    this.onCode = this.onCode.bind(this);
    this.onMissingCode = this.onMissingCode.bind(this);
  }

  /**
   * Catch the camera result on code detection
   *
   * @param {String} barcode
   */
  onCode(barcode) {
    const { next, nextMethod, onSelectedContainer } = this.props;

    if (!next) {
      return navigate(PIPE_CONTAINER_INFOS, { barcode });
    }

    navigate(PIPE_SELECT_CONTAINER, { next, nextMethod, barcode, onSelectedContainer }, nextMethod);
  }

  onMissingCode() {
    const { next, nextMethod, onSelectedContainer } = this.props;

    navigate(PIPE_SEARCH_CONTAINER, { next, nextMethod, onSelectedContainer }, nextMethod);
  }

  renderMissingCodeButton() {
    if (!this.props.missingCode) {
      return null;
    }

    const { styles } = this.constructor;

    return (
      <View styleName="horizontal">
        <Button style={styles.button} onPress={this.onMissingCode}>
          <Text style={styles.buttonText}>{I18n.t('scenes.container.invite_scan.no_barcode')}</Text>
        </Button>
      </View>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { isFocused } = this.props;

    return (
      <WrapperView full>
        <Scan onCode={this.onCode} active={isFocused} />
        {this.renderMissingCodeButton()}
      </WrapperView>
    );
  }
}

export default connect((state, props) => ({
  missingCode: props.navigation.getParam('missingCode'),
  next: props.navigation.getParam('next', null),
  nextMethod: props.navigation.getParam('nextMethod'),
  onSelectedContainer: props.navigation.getParam('onSelectedContainer'),
}))(withNavigationFocus(ScanContainer));
