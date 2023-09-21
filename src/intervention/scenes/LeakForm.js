import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Text, View } from 'react-native';
import { get } from 'k2/app/container';
import { TextArea, Button, FormAbstract } from 'k2/app/modules/common/components/form';
import ComponentModel from 'k2/app/modules/installation/models/Component';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { GUTTER } from 'k2/app/modules/common/styles/vars';
import { addLeak, cancelLeak } from '../actions/interventionPipe';

class LeakForm extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    addLeak: PropTypes.func.isRequired,
    cancelLeak: PropTypes.func.isRequired,
    leakingComponent: PropTypes.instanceOf(ComponentModel),
    index: PropTypes.number,
  };

  static defaultProps = {
    leakingComponent: null,
    index: 0,
  };

  static styles = {
    wrapper: {},
    locationInput: {
      marginTop: GUTTER,
      padding: GUTTER / 2,
      borderWidth: 1,
      borderColor: '#EEE',
    },
    locationLabel: FormAbstract.styles.label,
    repairedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: GUTTER,
    },
    repairedLabel: {
      flex: 0,
      marginRight: GUTTER,
    },
    repairedWidget: {
      flex: 0,
    },
    submitButton: {
      flex: 1,
      marginTop: GUTTER,
    },
  };

  constructor(props) {
    super(props);

    this.translations = I18n.t('scenes.intervention.select_leaking_component.leak_form');

    this.state = {
      location: '',
      repaired: false,
    };

    this.setRepaired = this.setRepaired.bind(this);
    this.setLocation = this.setLocation.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUnmount() {
    const { index } = this.props;

    this.props.cancelLeak(index);
  }

  onSubmit() {
    if (!this.isFormValid()) {
      return;
    }

    const { index, leakingComponent, next } = this.props;
    const { location, repaired } = this.state;

    this.props.addLeak(leakingComponent ? leakingComponent.uuid : null, location, repaired, index);
    next(undefined, 'push');
  }

  /**
   * @param {Boolean} repaired
   */
  setRepaired(repaired) {
    this.setState({ repaired });
  }

  /**
   * @param {Boolean} location
   */
  setLocation(location) {
    this.setState({ location });
  }

  getSubTitle() {
    const { leakingComponent } = this.props;

    if (!leakingComponent) {
      return I18n.t('scenes.intervention.select_leaking_component.not_a_component');
    }

    const { nature, designation } = leakingComponent;
    const description = designation ? ` "${designation}"` : '';

    return `${nature.designation.toString()} ${description}`;
  }

  /**
   * @return {Boolean}
   */
  isFormValid() {
    const { leakingComponent } = this.props;
    const { location } = this.state;

    return !!(leakingComponent || location.length > 0);
  }

  render() {
    const { styles } = LeakForm;
    const { leakingComponent } = this.props;
    const { location, repaired } = this.state;

    return (
      <WrapperView scrollable style={styles.wrapper} title={this.translations.title} subtitle={this.getSubTitle()}>
        <View style={styles.locationRow}>
          <Text style={styles.locationLabel}>{this.translations.location}</Text>
          <TextArea
            style={styles.locationInput}
            defaultValue={location}
            maxLength={80}
            onChangeText={this.setLocation}
            optional={!leakingComponent}
            autoFocus
          />
        </View>

        <View style={styles.repairedRow}>
          <Text style={styles.repairedLabel}>{this.translations.repaired}</Text>
          <Switch style={styles.repairedWidget} trackColor="#AAA" value={repaired} onValueChange={this.setRepaired} />
        </View>

        <Button style={styles.submitButton} onPress={this.onSubmit} valid={this.isFormValid()}>
          {I18n.t('common.submit')}
        </Button>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    index: props.navigation.getParam('index'),
    next: props.navigation.getParam('next'),
    leakingComponent: get('component_repository').find(props.navigation.getParam('leakingComponent')),
  }),
  dispatch => ({
    addLeak: (uuid, location, repaired, index) => dispatch(addLeak(uuid, location, repaired, index)),
    cancelLeak: index => dispatch(cancelLeak(index)),
  }),
)(LeakForm);
