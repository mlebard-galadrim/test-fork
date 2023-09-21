import { get } from 'k2/app/container';
import MainListView from 'k2/app/modules/common/components/list/MainListView';
import Tabs from 'k2/app/modules/common/components/tabs/Tabs';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { COLOR_LIGHT_BG, COLOR_PRIMARY, COLOR_WARNING } from 'k2/app/modules/common/styles/vars';
import InterventionRow from 'k2/app/modules/intervention/components/InterventionRow';
import { navigate } from 'k2/app/navigation';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createIntervention } from '../actions/interventionPipe';
import { PIPE_ANALYSIS_INFOS, PIPE_INTERVENTION_INFOS } from '../constants';
import AnalysisRow from '../components/AnalysisRow';
import InterventionType from '../models/InterventionType';
import { createAnalysis } from '../../analysis/actions/oilAnalysisActions';
import { selectInstallation } from '../../installation/actions/installationPipe';

/**
 * Intervention List scene
 */
class InterventionList extends Component {
  static styles = {
    list: {},
  };

  constructor(props) {
    super(props);
    const interventionsArray = Array.from(get('intervention_repository').findAll());

    interventionsArray.forEach(intervention => {
      intervention.intervention_type = 'intervention';
    });

    const analysesArray = Array.from(get('analysis_repository').findAll());

    analysesArray.forEach(analysis => {
      analysis.intervention_type = 'analysis';
    });
    this.state = {
      allInterventions: [...interventionsArray, ...analysesArray].sort((a, b) => {
        return -1 * ((a?.performedAt ?? a?.creation) - (b?.performedAt ?? b?.creation));
      }),

      plannedInterventions: Array.from(get('intervention_planned_repository').findAll().sorted('plannedAt', true)),
    };

    this.selectIntervention = this.selectIntervention.bind(this);
    this.getInterventionRowStyle = this.getInterventionRowStyle.bind(this);
    this.selectPlannedIntervention = this.selectPlannedIntervention.bind(this);

    this.interventionReportRepository = get('intervention_report_repository');
  }

  selectIntervention(intervention) {
    switch (intervention.intervention_type) {
      case 'intervention': {
        navigate(PIPE_INTERVENTION_INFOS, { id: intervention.id });
        break;
      }
      case 'analysis': {
        navigate(PIPE_ANALYSIS_INFOS, { id: intervention.uuid });
        break;
      }
    }
  }

  selectPlannedAnalysis(analysis) {
    this.props.createAnalysis(analysis.id);

    const validator = get('validator');
    const orchestrator = get('analysis_orchestrator');
    const installationRepository = get('installation_repository');

    function next(props = {}, type = undefined) {
      const step = orchestrator.getStep();

      navigate(step.name, { next, ...props, ...step.props }, type);
    }

    const installation = installationRepository.find(analysis.installation);
    this.props.selectInstallation(installation);

    validator.validate([validator.isCOPCValid(true), validator.isInstallationValid(installation)], () => next({}));
  }

  selectPlannedIntervention(intervention) {
    if (intervention.type === InterventionType.ANALYSIS) {
      this.selectPlannedAnalysis(intervention);
      return;
    }
    this.props.createIntervention(intervention.type, intervention.installation, intervention.purpose, intervention.id);

    const validator = get('validator');
    const orchestrator = get('intervention_orchestrator');
    const installationRepository = get('installation_repository');

    function next(props = {}, type = undefined) {
      const step = orchestrator.getStep();

      navigate(step.name, { next, ...props, ...step.props }, type);
    }

    const installation = installationRepository.find(intervention.installation);

    validator.validate([validator.isCOPCValid(true), validator.isInstallationValid(installation)], () => next({}));
  }

  /**
   * Compute styles for a specific intervention row with a left indicator about the intervention report status if any.
   *
   * @param {Intervention} intervention
   */
  getInterventionRowStyle(intervention) {
    const REPORT_CLOSED = COLOR_PRIMARY;
    const REPORT_IN_PROGRESS = COLOR_WARNING;
    const NO_REPORT = COLOR_LIGHT_BG;

    let color;
    if (intervention.reportUrl) {
      color = REPORT_CLOSED;
    } else {
      const currentReport = this.interventionReportRepository.findLastByIntervention(intervention);
      if (currentReport) {
        color = currentReport.closed ? REPORT_CLOSED : REPORT_IN_PROGRESS;
      }
    }

    return {
      borderLeftWidth: 5,
      borderLeftColor: color || NO_REPORT,
    };
  }

  /**
   * @inheritdoc
   */
  render() {
    const { styles } = InterventionList;
    const { allInterventions, plannedInterventions } = this.state;
    return (
      <WrapperView full>
        <Tabs tabs={['scenes.my_interventions.completed', 'scenes.my_interventions.planned']}>
          <MainListView
            style={styles.list}
            getRowStyles={this.getInterventionRowStyle}
            data={allInterventions}
            renderContent={intervention => {
              switch (intervention.intervention_type) {
                case 'intervention': {
                  return <InterventionRow intervention={intervention} />;
                }
                case 'analysis': {
                  return <AnalysisRow analysis={intervention} />;
                }
              }
            }}
            noDataContent="scenes.my_interventions.list:empty"
            onPressItem={this.selectIntervention}
          />
          <MainListView
            style={styles.list}
            getRowStyles={this.getInterventionRowStyle}
            data={plannedInterventions}
            renderContent={intervention => <InterventionRow intervention={intervention} />}
            noDataContent="scenes.my_interventions.list:empty"
            onPressItem={this.selectPlannedIntervention}
          />
        </Tabs>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({}),
  dispatch => ({
    createIntervention: (target, installation, purpose, uuid) =>
      dispatch(createIntervention(target, installation, purpose, uuid)),
    createAnalysis: uuid => dispatch(createAnalysis(uuid)),
    selectInstallation: installationId => dispatch(selectInstallation(installationId)),
  }),
)(InterventionList);
