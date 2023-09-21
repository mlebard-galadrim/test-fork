import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { back } from 'k2/app/navigation';
import I18n from 'i18n-js';
import NavigationButton from 'k2/app/modules/common/components/NavigationButton';
import { Alert } from 'react-native';

export default class BackButton extends Component {
  static propTypes = {
    backConfirm: PropTypes.oneOfType([
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
      }),
    ]),
  };

  static defaultProps = {
    backConfirm: null,
  };

  constructor(props, context) {
    super(props, context);

    this.onBack = this.onBack.bind(this);
  }

  /**
   * On back button pressed
   */
  onBack() {
    const { backConfirm } = this.props;

    if (!backConfirm) {
      return back();
    }

    const { title, content } = backConfirm;

    return Alert.alert(I18n.t(title), I18n.t(content), [
      { text: I18n.t('common.cancel'), style: 'cancel' },
      {
        text: I18n.t('common.ok'),
        onPress: back,
      },
    ]);
  }

  render() {
    return <NavigationButton icon="chevron-left" onPress={this.onBack} testID="chevron-left" />;
  }
}
