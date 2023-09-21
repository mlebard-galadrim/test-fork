import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { Button } from 'k2/app/modules/common/components/form';
import ComponentList from 'k2/app/modules/installation/components/ComponentList';
import Intervention from '../models/Intervention';
import { PIPE_LEAK_FORM } from '../constants';

class SelectLeakingComponent extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    intervention: PropTypes.instanceOf(Intervention).isRequired,
    index: PropTypes.number,
  };

  static defaultProps = {
    index: 0,
  };

  static styles = {
    listView: {
      flex: 1,
    },
    notAComponentButton: {
      flex: 0,
      borderRadius: 0,
    },
    column: {
      flexDirection: 'column',
    },
  };

  constructor(props) {
    super(props);

    this.installationRepository = get('installation_repository');
    this.translations = I18n.t('scenes.intervention.select_leaking_component');
    this.state = {
      installation: this.installationRepository.find(props.intervention.installation),
    };

    this.selectLeakingComponent = this.selectLeakingComponent.bind(this);
    this.selectOutOfComponentsLeak = this.selectOutOfComponentsLeak.bind(this);
  }

  /**
   * Select a leaking component and go to leak form
   *
   * @param {Component} leakingComponent
   */
  selectLeakingComponent(leakingComponent) {
    const { index, next } = this.props;

    navigate(PIPE_LEAK_FORM, { leakingComponent: leakingComponent.uuid, index, next }, 'push');
  }

  /**
   * Declare a leak out of components and go to leak form
   */
  selectOutOfComponentsLeak() {
    const { index, next } = this.props;

    navigate(PIPE_LEAK_FORM, { index, next }, 'push');
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { intervention } = this.props;
    const { installation } = this.state;

    return (
      <WrapperView full title={this.translations.title} style={styles.column}>
        <ComponentList
          style={styles.listView}
          components={Array.from(installation.primaryCircuit.components)}
          leaks={intervention.leaks}
          onPressItem={this.selectLeakingComponent}
        />
        <Button style={styles.notAComponentButton} onPress={this.selectOutOfComponentsLeak}>
          {this.translations.not_a_component}
        </Button>
      </WrapperView>
    );
  }
}

export default connect((state, props) => ({
  intervention: state.interventionPipe.intervention,
  index: props.navigation.getParam('index'),
  next: props.navigation.getParam('next'),
}))(SelectLeakingComponent);
