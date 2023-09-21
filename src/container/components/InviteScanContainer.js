import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import InviteScan from 'k2/app/modules/common/components/InviteScan';
import { PIPE_SCAN_CONTAINER, PIPE_SEARCH_CONTAINER } from '../constants';

/**
 * Standalone invite scan container view to be used by any pipe requiring to scan/select/create containers.
 */
class InviteScanContainer extends Component {
  static propTypes = {
    children: PropTypes.node,
    next: PropTypes.func.isRequired,
    prepareContainer: PropTypes.func,
    cancelContainer: PropTypes.func,
    onSelectedContainer: PropTypes.func,
  };

  static defaultProps = {
    onSelectedContainer: () => {},
    prepareContainer: null,
    cancelContainer: null,
    children: null,
  };

  constructor(props) {
    super(props);

    this.analytics = get('firebase-analytics');

    this.onMissingCode = this.onMissingCode.bind(this);
    this.onScanCode = this.onScanCode.bind(this);
  }

  componentDidMount() {
    this.props.prepareContainer && this.props.prepareContainer();
  }

  componentWillUnmount() {
    this.props.cancelContainer && this.props.cancelContainer();
  }

  /**
   * onMissingCode callback
   */
  onMissingCode() {
    const { next, onSelectedContainer } = this.props;

    this.analytics.logEvent('container_search');

    navigate(PIPE_SEARCH_CONTAINER, { next, nextMethod: 'push', onSelectedContainer }, 'push');
  }

  /**
   * onScanCode callback
   */
  onScanCode() {
    const { next, onSelectedContainer } = this.props;

    this.analytics.logEvent('container_scan');

    navigate(PIPE_SCAN_CONTAINER, { next, nextMethod: 'push', onSelectedContainer }, 'push');
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { children } = this.props;

    return (
      <InviteScan
        title={I18n.t('scenes.container.invite_scan.title')}
        onMissingCode={this.onMissingCode}
        onScanCode={this.onScanCode}
      >
        {children}
      </InviteScan>
    );
  }
}

export default InviteScanContainer;
