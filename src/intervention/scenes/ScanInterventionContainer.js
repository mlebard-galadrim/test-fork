import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'k2/app/container';
import Text from 'k2/app/modules/common/components/Text';
import Purpose from 'k2/app/modules/intervention/models/Purpose';
import InviteScanContainer from 'k2/app/modules/container/components/InviteScanContainer';
import {
  addInterventionContainer,
  addInterventionContainerLoad,
  moveInterventionContainers,
  removeInterventionContainer,
} from 'k2/app/modules/intervention/actions/interventionPipe';

/**
 * Invite Scan Container scene for interventions
 */
class ScanInterventionContainer extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    addInterventionContainerLoad: PropTypes.func.isRequired,
    removeInterventionContainer: PropTypes.func.isRequired,
    addInterventionContainer: PropTypes.func.isRequired,
    moveInterventionContainers: PropTypes.func.isRequired,
    purpose: PropTypes.oneOf(Purpose.values).isRequired,
    installationUuid: PropTypes.string.isRequired,
  };

  static styles = {
    subtitle: {
      textAlign: 'center',
      color: '#fff',
    },
  };

  constructor(props) {
    super(props);

    this.analytics = get('firebase-analytics');
    this.installationRepository = get('installation_repository');
    this.validator = get('validator');

    this.addInterventionContainer = this.addInterventionContainer.bind(this);
  }

  addInterventionContainer(container) {
    const { validator } = this;

    return new Promise((resolve, reject) => {
      const add = (move = null) => {
        this.props.addInterventionContainer(container);
        move && this.props.moveInterventionContainers();

        resolve();
      };

      validator.validate(
        [
          validator.isArticleValid(container.article.uuid),
          validator.isContainerPressureValid(container.article.pressure),
          validator.isContainerFluidValid(container.fluid),
        ],
        // On valid container:
        () => {
          const result = validator.isContainerOnSite(container.id);

          if (result === true) {
            return add();
          }

          result(
            () => add(false),
            () => add(true),
          );
        },
        // On validation failures:
        () => {
          reject(new Error('Invalid container for intervention'));
        },
      );
    });
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { purpose, installationUuid, next } = this.props;
    const installation = this.installationRepository.find(installationUuid);

    return (
      <InviteScanContainer
        next={next}
        prepareContainer={this.props.addInterventionContainerLoad}
        cancelContainer={this.props.removeInterventionContainer}
        onSelectedContainer={this.addInterventionContainer}>
        <Text styleName="subtitle" style={styles.subtitle}>
          {I18n.t('scenes.container.invite_scan.installation', {
            installation: installation.name,
          })}
        </Text>
        <Text styleName="subtitle" style={styles.subtitle}>
          {I18n.t('scenes.container.invite_scan.purpose', {
            purpose: I18n.t(Purpose.readableFor(purpose)),
          })}
        </Text>
      </InviteScanContainer>
    );
  }
}

export default connect(
  (state, props) => ({
    purpose: state.interventionPipe.intervention.purpose,
    installationUuid: state.interventionPipe.intervention.installation,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    addInterventionContainerLoad: () => dispatch(addInterventionContainerLoad()),
    removeInterventionContainer: () => dispatch(removeInterventionContainer()),
    addInterventionContainer: container => dispatch(addInterventionContainer(container)),
    moveInterventionContainers: () => dispatch(moveInterventionContainers()),
  }),
)(ScanInterventionContainer);
