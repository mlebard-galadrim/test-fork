import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'k2/app/modules/common/components/Loader';
import { get } from 'k2/app/container';
import { backToDashboard } from 'k2/app/navigation';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import Fieldset from 'k2/app/modules/common/components/Fieldset';
import Definition from 'k2/app/modules/common/components/Definition';
import { COLOR_WARNING, GUTTER } from 'k2/app/modules/common/styles/vars';
import AnalysisNature from '../../analysis/models/AnalysisNature';

class AnalysisInfos extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    format: PropTypes.string,
  };

  static defaultProps = {
    format: 'date.formats.moment_datepicker',
  };

  static styles = {
    spinner: {
      flex: 1,
      margin: 20,
    },
    message: {
      textAlign: 'center',
    },
    signature: {
      flex: 0,
      width: 160,
      height: 80,
      resizeMode: 'contain',
    },
    signatureBox: {
      flex: 1,
    },
    fullWidth: {
      marginLeft: -GUTTER,
      marginRight: -GUTTER,
    },
    chain: {
      marginBottom: GUTTER,
    },
    reportActions: {
      marginBottom: GUTTER,
    },
    unclosedReportWarning: {
      paddingBottom: GUTTER,
      color: COLOR_WARNING,
    },
  };

  constructor(props) {
    super(props);

    this.installationRepository = get('installation_repository');
    this.analysisRepository = get('analysis_repository');
    this.analysisTypeRepository = get('analysis_type_repository');
    this.nextOperationResolver = get('next_operation_resolver');
    this.analytics = get('firebase-analytics');

    this.state = {
      analysis: undefined,
    };
  }

  /**
   * {@inheritdoc}
   */
  componentDidMount() {
    this.loadAnalysis(this.props.id);
  }

  /**
   * {@inheritdoc}
   */
  componentDidUpdate(prevProps) {
    const { id } = this.props;

    if (id !== prevProps.id) {
      this.loadAnalysis(id);
    }
  }

  /**
   * Load analysis from id
   *
   * @param {String} id
   */
  loadAnalysis(id) {
    this.setState({ analysis: this.analysisRepository.find(id) });
  }

  chainWith(type) {
    const { analysis } = this.state;

    backToDashboard({ chain: { analysis, type } });
  }

  renderLoading() {
    return (
      <WrapperView title={I18n.t('scenes.intervention_infos.loading')}>
        <Loader style={this.constructor.styles.spinner} />
      </WrapperView>
    );
  }

  renderNoResult() {
    return (
      <WrapperView title={I18n.t('scenes.intervention_infos.not_found.title')}>
        <Text style={this.constructor.styles.message}>{I18n.t('scenes.intervention_infos.not_found.content')}</Text>
      </WrapperView>
    );
  }

  renderAnalysis(analysis) {
    const { format } = this.props;
    const installation = this.installationRepository.find(analysis.installationUuid);
    const type = this.analysisTypeRepository.find(analysis.type);
    const { nature, designation, explanation } = type;
    const { creation } = analysis;
    return (
      <WrapperView
        scrollable
        title={I18n.t(AnalysisNature.readableFor(nature))}
        // subtitle={I18n.t(Purpose.readableFor(purpose))}
      >
        <Fieldset title={I18n.t('scenes.intervention_infos.situation')}>
          <Definition label={I18n.t('scenes.intervention.sum_up.client')} value={installation.site.client.name} />
          <Definition label={I18n.t('scenes.intervention.sum_up.site')} value={installation.site.name} />
          <Definition label={I18n.t('scenes.intervention.sum_up.installation')} value={installation.name} />
          <Definition label={I18n.t('scenes.intervention.sum_up.designation')} value={designation.toString()} />
          <Definition label={I18n.t('scenes.intervention.sum_up.explanation')} value={explanation.toString()} />
          <Definition
            label={I18n.t('scenes.intervention_infos.creation')}
            value={moment(creation).format(I18n.t(format))}
          />
        </Fieldset>
      </WrapperView>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { analysis } = this.state;

    if (analysis === undefined) {
      return this.renderLoading();
    }

    if (analysis === null) {
      return this.renderNoResult();
    }

    return this.renderAnalysis(analysis);
  }
}

export default connect(
  (state, props) => ({
    id: props.navigation.getParam('id'),
  }),
  //   (dispatch, props) => ({
  //     addSignature: (type, signature) => dispatch(addSignature(props.navigation.getParam('id'), type, signature)),
  //     createReport: (...args) => dispatch(start(...args)),
  //     editReport: (...args) => dispatch(edit(...args)),
  //   }),
)(AnalysisInfos);
