import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-native';
import I18n from 'i18n-js';
import { get } from 'k2/app/container';
import { backToDashboard } from 'k2/app/navigation';
import NavigationButton from 'k2/app/modules/common/components/NavigationButton';

export default class HomeButton extends Component {
  static propTypes = {
    exit: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.string,
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        content: PropTypes.string,
      }),
    ]).isRequired,
  };

  static defaultProps = {
    exit: true,
  };

  constructor() {
    super();

    this.analytics = get('firebase-analytics');

    this.onExit = this.onExit.bind(this);
  }

  /**
   * On exit button pressed
   */
  onExit() {
    const { exit } = this.props;

    if (exit === true) {
      return backToDashboard();
    }

    let { title, content } = typeof exit === 'string' ? { title: exit } : exit;
    title = title || 'common.exit.default.title';
    content = content || 'common.exit.default.content';

    return Alert.alert(I18n.t(title), I18n.t(content), [
      { text: I18n.t('common.cancel'), style: 'cancel' },
      {
        text: I18n.t('common.ok'),
        onPress: () => {
          this.analytics.logEvent('cancel_intervention');
          backToDashboard();
        },
      },
    ]);
  }

  render() {
    return <NavigationButton icon="home" onPress={this.onExit} testID="home" />;
  }
}
