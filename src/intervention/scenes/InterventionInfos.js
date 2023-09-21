import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Linking, Text, View } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import Loader from 'k2/app/modules/common/components/Loader';
import { get } from 'k2/app/container';
import { backToDashboard } from 'k2/app/navigation';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import Fieldset from 'k2/app/modules/common/components/Fieldset';
import Definition from 'k2/app/modules/common/components/Definition';
import { Button } from 'k2/app/modules/common/components/form';
import SignatureBox from 'k2/app/modules/common/components/SignatureBox';
import { COLOR_WARNING, GUTTER } from 'k2/app/modules/common/styles/vars';
import InterventionType from '../models/InterventionType';
import Purpose from '../models/Purpose';
import { addSignature } from '../actions/interventionPipe';
import ContainerLoadList from '../components/ContainerLoadList';
import LeakList from '../components/LeakList';
import { edit, start } from 'k2/app/modules/intervention_report/actions/interventionReportActions';
import { navigate } from 'k2/app/navigation';
import { PIPE_INTERVENTION_REPORT_SELECT_INTERVENTIONS } from 'k2/app/modules/intervention_report/constants';

class InterventionInfos extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    addSignature: PropTypes.func.isRequired,
    createReport: PropTypes.func.isRequired,
    editReport: PropTypes.func.isRequired,
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
    this.detectorRepository = get('detector_repository');
    this.interventionRepository = get('intervention_repository');
    this.interventionReportRepository = get('intervention_report_repository');
    this.nextOperationResolver = get('next_operation_resolver');
    this.analytics = get('firebase-analytics');

    this.state = {
      intervention: undefined,
    };

    this.goToReport = this.goToReport.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  componentDidMount() {
    this.loadIntervention(this.props.id);
  }

  /**
   * {@inheritdoc}
   */
  componentDidUpdate(prevProps) {
    const { id } = this.props;

    if (id !== prevProps.id) {
      this.loadIntervention(id);
    }
  }

  /**
   * Load intervention from id
   *
   * @param {String} id
   */
  loadIntervention(id) {
    this.setState({ intervention: this.interventionRepository.find(id) });
  }

  chainWith(type) {
    const { intervention } = this.state;

    backToDashboard({ chain: { intervention, type } });
  }

  /**
   * @param {Intervention} intervention
   * @param {Installation} installation
   * @param {InterventionReport|null}currentReport
   */
  goToReport(intervention, installation, currentReport = null) {
    if (currentReport) {
      this.props.editReport(currentReport);
    } else {
      this.props.createReport(installation.site, intervention.creation);
    }

    navigate(PIPE_INTERVENTION_REPORT_SELECT_INTERVENTIONS);
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

  renderContent(intervention, installation) {
    const { styles } = this.constructor;
    const { type, containerLoads } = intervention;
    const { DRAINAGE, FILLING, LEAK, LEAK_REPAIR } = InterventionType;

    if ([DRAINAGE, FILLING].includes(type)) {
      return (
        <Fieldset title={I18n.t('scenes.intervention_infos.containers')}>
          <ContainerLoadList
            title={null}
            style={styles.fullWidth}
            containerLoads={Array.from(containerLoads)}
            loading={type === FILLING}
            installation={installation.id}
          />
        </Fieldset>
      );
    }

    if ([LEAK, LEAK_REPAIR].includes(type)) {
      const detector = this.detectorRepository.find(intervention.detector);

      return (
        <Fieldset title={I18n.t('scenes.intervention_infos.leaks')}>
          <Definition
            label={I18n.t('scenes.intervention.leak_detection_sum_up.detector:caption')}
            value={detector.designation || detector.barcode || detector.serialNumber}
          />
          <LeakList
            style={styles.fullWidth}
            leaks={Array.from(intervention.leaks)}
            noDataContent="scenes.intervention.leak_detection_sum_up.leaks:none"
          />
        </Fieldset>
      );
    }

    return null;
  }

  renderDocuments(intervention) {
    const { fibsdUrl, annexUrl, reportUrl } = intervention;

    if (!fibsdUrl && !annexUrl && !reportUrl) {
      return null;
    }

    return (
      <Fieldset title={I18n.t('scenes.intervention_infos.documents.title')}>
        {fibsdUrl && (
          <Definition
            label={I18n.t('scenes.intervention_infos.documents.fibsd:label')}
            value={I18n.t('scenes.intervention_infos.documents.fibsd:link')}
            linkTo={() => {
              this.analytics.logEvent('intervention_document', {
                type: 'fibsd',
              });
              Linking.openURL(fibsdUrl);
            }}
          />
        )}
        {annexUrl && (
          <Definition
            label={I18n.t('scenes.intervention_infos.documents.annex:label')}
            value={I18n.t('scenes.intervention_infos.documents.annex:link')}
            linkTo={() => {
              this.analytics.logEvent('intervention_document', {
                type: 'annex',
              });
              Linking.openURL(annexUrl);
            }}
          />
        )}
        {reportUrl && (
          <Definition
            label={I18n.t('scenes.intervention_infos.documents.report:label')}
            value={I18n.t('scenes.intervention_infos.documents.report:link')}
            linkTo={() => {
              this.analytics.logEvent('intervention_document', {
                type: 'report',
              });
              Linking.openURL(reportUrl);
            }}
          />
        )}
      </Fieldset>
    );
  }

  renderNextInterventionSection(intervention, installation) {
    const suggestions = this.nextOperationResolver.resolve(intervention);

    if (suggestions.length === 0 || installation.isDeleted) {
      return null;
    }

    const { styles } = this.constructor;

    return (
      <Fieldset title={I18n.t('scenes.intervention_infos.chain.title')}>
        <View>
          {suggestions.map(suggestion => (
            <Button key={suggestion} onPress={() => this.chainWith(suggestion)} style={styles.chain}>
              {I18n.t(`scenes.intervention_infos.chain.${suggestion}`)}
            </Button>
          ))}
        </View>
      </Fieldset>
    );
  }

  renderReportActions(intervention, installation) {
    const { styles } = this.constructor;
    const { reportUrl } = intervention;

    if (reportUrl) {
      // Don't suggest to create/edit a report if already generated
      return null;
    }

    // If an ongoing report exists for the intervention (whatever the date is), we can only suggest to edit it:
    const currentReport = this.interventionReportRepository.findLastByIntervention(intervention);

    let actions = [
      // Show warning about sync on non closed report:
      currentReport && (
        <Text key={'report-unclosed-warning'} style={styles.unclosedReportWarning}>
          {I18n.t('scenes.intervention_infos.warning.unclosed_report')}
        </Text>
      ),
      <Button
        key="create-report"
        onPress={() => this.goToReport(intervention, installation, currentReport)}
        style={styles.reportActions}
      >
        {I18n.t(`scenes.intervention_infos.actions.report.${currentReport ? 'edit' : 'create'}`)}
      </Button>,
    ];

    // But if it's closed, it cannot be modified again:
    if (currentReport && currentReport.closed) {
      actions = <Text>{I18n.t('scenes.intervention_infos.actions.closed_report')}</Text>;
    }

    return (
      <Fieldset title={I18n.t('scenes.intervention_infos.actions.sections.report')}>
        <View>{actions}</View>
      </Fieldset>
    );
  }

  /**
   * Render signature block
   *
   * @param {String} signature
   * @param {String} label
   * @param {Function} callback
   *
   * @return {View}
   */
  renderSignature(signature, label, callback) {
    const { styles } = this.constructor;
    let value = null;

    if (signature) {
      value = <Image style={styles.signature} source={{ uri: signature }} />;
    } else {
      value = <SignatureBox style={styles.signatureBox} title={label} onSignature={callback} />;
    }

    return <Definition label={label} value={value} />;
  }

  renderSignatures(operatorSignature, clientSignature) {
    if (!operatorSignature && !clientSignature) {
      return null;
    }

    return (
      <Fieldset title={I18n.t('scenes.intervention_infos.signature')}>
        {this.renderSignature(operatorSignature, I18n.t('scenes.intervention.sum_up.operator_sign'), signature =>
          this.props.addSignature('operator', signature),
        )}
        {this.renderSignature(clientSignature, I18n.t('scenes.intervention.sum_up.client_sign'), signature =>
          this.props.addSignature('client', signature),
        )}
      </Fieldset>
    );
  }

  renderIntervention(intervention) {
    const { format } = this.props;
    const installation = this.installationRepository.find(intervention.installation);
    const { observations, type, purpose, creation, performedAt, operatorSignature, clientSignature, record } =
      intervention;

    return (
      <WrapperView
        scrollable
        title={I18n.t(InterventionType.readableFor(type))}
        subtitle={I18n.t(Purpose.readableFor(purpose))}
      >
        <Fieldset title={I18n.t('scenes.intervention_infos.situation')}>
          <Definition label={I18n.t('scenes.intervention.sum_up.client')} value={installation.site.client.name} />
          <Definition label={I18n.t('scenes.intervention.sum_up.site')} value={installation.site.name} />
          <Definition label={I18n.t('scenes.intervention.sum_up.installation')} value={installation.name} />
          <Definition label={I18n.t('scenes.intervention.sum_up.record_number')} value={record} />
          <Definition
            label={I18n.t('scenes.intervention_infos.creation')}
            value={moment(performedAt ?? creation).format(I18n.t(format))}
          />
          <Definition label={I18n.t('scenes.intervention.sum_up.observations:label')} value={observations} />
        </Fieldset>
        {this.renderContent(intervention, installation)}
        {this.renderDocuments(intervention)}
        {this.renderSignatures(operatorSignature, clientSignature)}
        {this.renderNextInterventionSection(intervention, installation)}
        {this.renderReportActions(intervention, installation)}
      </WrapperView>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { intervention } = this.state;

    if (intervention === undefined) {
      return this.renderLoading();
    }

    if (intervention === null) {
      return this.renderNoResult();
    }

    return this.renderIntervention(intervention);
  }
}

export default connect(
  (state, props) => ({
    id: props.navigation.getParam('id'),
  }),
  (dispatch, props) => ({
    addSignature: (type, signature) => dispatch(addSignature(props.navigation.getParam('id'), type, signature)),
    createReport: (...args) => dispatch(start(...args)),
    editReport: (...args) => dispatch(edit(...args)),
  }),
)(InterventionInfos);
