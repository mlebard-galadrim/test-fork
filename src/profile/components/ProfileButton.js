import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { toggleDrawer } from 'k2/app/navigation';
import IconBadge from 'k2/app/modules/common/components/IconBadge';
import NavigationButton from 'k2/app/modules/common/components/NavigationButton';

class ProfileButton extends Component {
  static propTypes = {
    notifications: PropTypes.bool.isRequired,
  };

  render() {
    return (
      <IconBadge active={this.props.notifications}>
        <NavigationButton icon="user-alt" onPress={toggleDrawer} testID="user-alt" />
      </IconBadge>
    );
  }
}

export default connect(state => ({
  notifications: state.authentication.localModificationsCount > 0,
}))(ProfileButton);
