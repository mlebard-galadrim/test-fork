import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';
import { navigate } from 'k2/app/navigation';
import Scan from '../../common/components/Scan';
import { PIPE_CONFIRM_INSTALLATION } from '../constants';
import WrapperView from '../../common/components/WrapperView';
import InstallationFilter from '../filters/InstallationFilter';

/**
 * Scan Installation scene
 */
class ScanInstallation extends Component {
  static propTypes = {
    isFocused: PropTypes.bool.isRequired,
    next: PropTypes.func.isRequired,
    filter: PropTypes.oneOf(InstallationFilter.values),
  };

  static defaultProps = {
    filter: null,
  };

  constructor() {
    super();

    this.onCode = this.onCode.bind(this);
  }

  /**
   * Catch the camera result on code detection
   *
   * @param {String} reference
   */
  onCode(reference) {
    const { next, filter } = this.props;

    //TODO/QUESTION: what if no reference?
    navigate(PIPE_CONFIRM_INSTALLATION, { reference, filter, next });
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { isFocused } = this.props;

    return (
      <WrapperView full>
        <Scan onCode={this.onCode} active={isFocused} />
      </WrapperView>
    );
  }
}

export default connect((state, props) => ({
  next: props.navigation.getParam('next'),
  filter: props.navigation.getParam('filter'),
}))(withNavigationFocus(ScanInstallation));
