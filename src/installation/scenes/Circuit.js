import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { navigate } from 'k2/app/navigation';
import CircuitModel from '../models/Circuit';
import WrapperView from '../../common/components/WrapperView';
import { Button } from '../../common/components/form';
import ComponentList from '../components/ComponentList';
import {
  PIPE_INSTALLATION_MANAGEMENT_CREATE_COMPONENT,
  PIPE_INSTALLATION_MANAGEMENT_EDIT_COMPONENT,
} from '../constants';

class Circuit extends Component {
  static propTypes = {
    circuit: PropTypes.instanceOf(CircuitModel).isRequired,
  };

  static styles = {
    list: {
      flex: 1,
    },
  };

  constructor(props) {
    super(props);

    this.goToCreateComponent = this.goToCreateComponent.bind(this);
    this.goToEditComponent = this.goToEditComponent.bind(this);
  }

  /**
   * Redirect to "Add component" scene
   */
  goToCreateComponent() {
    navigate(PIPE_INSTALLATION_MANAGEMENT_CREATE_COMPONENT);
  }

  /**
   * Redirect to "Edit component"
   */
  goToEditComponent(component) {
    navigate(PIPE_INSTALLATION_MANAGEMENT_EDIT_COMPONENT, { model: component });
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { circuit } = this.props;
    const circuitType = I18n.t(
      `scenes.installation.installation.circuit.${circuit.isPrimary() ? 'primary' : 'secondary'}`,
    );

    return (
      <WrapperView
        full
        title={I18n.t('scenes.installation.installation.circuit.title')}
        subtitle={`${circuit.installation.reference} - ${circuitType}`}
      >
        <ComponentList
          style={styles.list}
          components={Array.from(circuit.components)}
          onPressItem={this.goToEditComponent}
        />
        <Button onPress={this.goToCreateComponent}>{I18n.t('scenes.installation.installation.components.add')}</Button>
      </WrapperView>
    );
  }
}

export default connect(state => ({
  circuit: state.installationManagementReducer.circuit,
}))(Circuit);
