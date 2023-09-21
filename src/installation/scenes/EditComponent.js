import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import { pop } from 'k2/app/navigation';
import CircuitModel from '../models/Circuit';
import ComponentModel from '../models/Component';
import { saveComponent, deleteComponent } from '../actions/installationManagementActions';
import WrapperView from '../../common/components/WrapperView';
//import { PIPE_INSTALLATION_MANAGEMENT_CIRCUIT } from '../constants';
import Alert from '../../common/utils/Alert';
import ComponentForm from './ComponentForm';

class EditComponent extends Component {
  static propTypes = {
    saveComponent: PropTypes.func.isRequired,
    deleteComponent: PropTypes.func.isRequired,
    circuit: PropTypes.instanceOf(CircuitModel).isRequired,
    model: PropTypes.instanceOf(ComponentModel).isRequired,
  };

  constructor(props) {
    super(props);

    this.validator = get('validator');

    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  /**
   * Submit form
   */
  onSubmit(data) {
    const { circuit, model } = this.props;

    this.validator.validate(this.validator.isComponentUnique(circuit, data, model), () => {
      this.props.saveComponent({ ...data, uuid: model.uuid });
      pop();
    });
  }

  onDelete() {
    const { model } = this.props;

    Alert.getConfirmAlert('scenes.installation.installation.edit_component.confirm_delete')(
      () => {},
      () => {
        this.props.deleteComponent(model.uuid);
        pop();
      },
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { model } = this.props;

    return (
      <WrapperView
        scrollable
        keyboardAware
        full
        title={I18n.t('scenes.installation.installation.edit_component.title')}
      >
        <ComponentForm onValidate={this.onSubmit} onDelete={this.onDelete} model={model} />
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    circuit: state.installationManagementReducer.circuit,
    model: props.navigation.getParam('model'),
  }),
  dispatch => ({
    saveComponent: data => dispatch(saveComponent(data)),
    deleteComponent: uuid => dispatch(deleteComponent(uuid)),
  }),
)(EditComponent);
