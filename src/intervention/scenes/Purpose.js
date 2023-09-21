import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FlatList, Dimensions, Text, View } from 'react-native';
import { get } from 'k2/app/container';
import chunk from 'k2/app/modules/common/utils/chunk';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { Button } from 'k2/app/modules/common/components/form';
import { COLOR_PRIMARY, COLOR_SECONDARY, COLOR_LIGHT_BG, GUTTER } from 'k2/app/modules/common/styles/vars';
import { border } from 'k2/app/modules/common/styles/utils';
import InterventionType from 'k2/app/modules/intervention/models/InterventionType';
import PurposeEnum from 'k2/app/modules/intervention/models/Purpose';
import { setPurpose } from 'k2/app/modules/intervention/actions/interventionPipe';

/**
 * Purpose scene
 */
class Purpose extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    setPurpose: PropTypes.func.isRequired,
    interventionType: PropTypes.oneOf(InterventionType.values).isRequired,
    installationId: PropTypes.string.isRequired,
  };

  static styles = {
    purposeListRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 0,
    },
    purposeListItem: {
      margin: 0,
      alignItems: 'center',
    },
    button: {
      justifyContent: 'center',
      minHeight: 120,
      margin: GUTTER / 2,
      padding: GUTTER / 2,
      ...border(2, 'solid', 'transparent'),
      borderRadius: 3,
      backgroundColor: COLOR_LIGHT_BG,
      width: (Dimensions.get('window').width - 3 * GUTTER) / 2,
    },
    buttonDisabled: {
      backgroundColor: '#fcfcfd',
    },
    buttonHighlighted: {
      borderColor: COLOR_PRIMARY,
    },
    buttonLabel: {
      color: COLOR_SECONDARY,
      fontWeight: 'bold',
      fontSize: 13,
      textAlign: 'center',
      margin: 0,
    },
    buttonLabelDisabled: {
      opacity: 0.6,
    },
    buttonLabelHighlighted: {
      color: COLOR_PRIMARY,
    },
  };

  constructor(props) {
    super(props);

    this.validator = get('validator');
    this.installationRepository = get('installation_repository');
    this.interventionRepository = get('intervention_repository');

    this.state = this.getState(props);

    this.setPurpose = this.setPurpose.bind(this);
    this.validate = this.validate.bind(this);
    this.renderPurposeRow = this.renderPurposeRow.bind(this);
    this.renderPurpose = this.renderPurpose.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  componentDidUpdate(prevProps) {
    const { interventionType, installationId } = this.props;

    if (interventionType !== prevProps.interventionType || installationId !== prevProps.installationId) {
      this.setState(this.getState(this.props));
    }
  }

  /**
   * {@inheritdoc}
   */
  componentWillUnmount() {
    this.props.setPurpose(null);
  }

  /**
   * Get state from props
   *
   * @param {Object} props
   *
   * @return {Object}
   */
  getState(props) {
    const { installationId, interventionType } = props;
    const purposes = PurposeEnum.getPurposesForInterventionType(interventionType);
    const installation = this.installationRepository.find(installationId);

    return {
      title: this.getTitle(interventionType),
      columns: purposes.length > 2 ? 2 : 1,
      purposes,
      installation,
      highlightedPurpose: this.computeHighlightedPurpose(interventionType, installation),
    };
  }

  /**
   * Get title according to intervention type
   *
   * @param {String} interventionType
   *
   * @return {String}
   */
  getTitle(interventionType) {
    switch (interventionType) {
      case InterventionType.DRAINAGE:
        return I18n.t('scenes.intervention.purpose.title:drainage');
      case InterventionType.FILLING:
        return I18n.t('scenes.intervention.purpose.title:filling');
      case InterventionType.LEAK:
        return I18n.t('scenes.intervention.purpose.title:leak');
      default:
        throw new Error(`Unsupported intervention of type "${interventionType}"`);
    }
  }

  /**
   * Set the purpose
   *
   * @param {String} purpose
   */
  setPurpose(purpose) {
    this.props.setPurpose(purpose);
    this.props.next();
  }

  validate(purpose) {
    this.validator.validate(this.validator.validatePurpose(purpose), () => this.setPurpose(purpose));
  }

  computeHighlightedPurpose(interventionType, installation) {
    if (InterventionType.FILLING !== interventionType) {
      return null;
    }

    const lastIntervention = this.interventionRepository.findLastInterventionForInstallation(installation.id);

    if (!lastIntervention) {
      return null;
    }

    if (PurposeEnum.TRANSFER === lastIntervention.purpose) {
      return PurposeEnum.FILLING_AFTER_TRANSFER;
    }

    return null;
  }

  renderPurpose(purpose) {
    const { styles } = this.constructor;
    const { highlightedPurpose } = this.state;
    const alert = this.validator.validatePurpose(purpose);
    const valid = alert === true || !alert.blocking;

    return (
      <View key={purpose} style={styles.purposeListItem}>
        <Button
          onPress={() => this.validate(purpose)}
          style={{
            ...styles.button,
            ...(highlightedPurpose === purpose ? styles.buttonHighlighted : {}),
            ...(!valid ? styles.buttonDisabled : {}),
          }}
        >
          <Text
            style={{
              ...styles.buttonLabel,
              ...(highlightedPurpose === purpose ? styles.buttonLabelHighlighted : {}),
              ...(!valid ? styles.buttonLabelDisabled : {}),
            }}
          >
            {I18n.t(`scenes.intervention.purpose.${PurposeEnum.readableFor(purpose)}`).toUpperCase()}
          </Text>
        </Button>
      </View>
    );
  }

  /**
   * Renders a single row of purpose items
   *
   * @param {String[]} purposes
   *
   * @return {String}
   */
  renderPurposeRow({ item }) {
    const { styles } = this.constructor;

    return <View style={styles.purposeListRow}>{item.map(this.renderPurpose)}</View>;
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { title, purposes, columns, installation } = this.state;

    return (
      <WrapperView full title={title} subtitle={`${installation.client.name} - ${installation.name}`}>
        <FlatList
          data={chunk(purposes, columns)}
          renderItem={this.renderPurposeRow}
          keyExtractor={(item, index) => String(index)}
          scrollEnabled={false}
        />
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    interventionType: state.interventionPipe.intervention.type,
    installationId: state.interventionPipe.intervention.installation,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    setPurpose: purpose => dispatch(setPurpose(purpose)),
  }),
)(Purpose);
