import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import { pop } from 'k2/app/navigation';
import CircuitModel from '../models/Circuit';
import { saveNewComponent } from '../actions/installationManagementActions';
import WrapperView from '../../common/components/WrapperView';
import ComponentForm from './ComponentForm';

class CreateComponent extends Component {
  static propTypes = {
    saveNewComponent: PropTypes.func.isRequired,
    circuit: PropTypes.instanceOf(CircuitModel).isRequired,
  };

  constructor(props) {
    super(props);

    this.validator = get('validator');

    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Submit form
   */
  onSubmit(component) {
    const { circuit } = this.props;

    this.validator.validate(this.validator.isComponentUnique(circuit, component), () => {
      this.props.saveNewComponent({ ...component, circuit });
      pop();
    });
  }

  /**
   * {@inheritdoc}
   */
  render() {
    return (
      <WrapperView scrollable keyboardAware full title={I18n.t('scenes.installation.installation.add_component.title')}>
        <ComponentForm onValidate={this.onSubmit} />
      </WrapperView>
    );
  }
}

export default connect(
  state => ({
    circuit: state.installationManagementReducer.circuit,
  }),
  dispatch => ({
    saveNewComponent: data => dispatch(saveNewComponent(data)),
  }),
)(CreateComponent);
