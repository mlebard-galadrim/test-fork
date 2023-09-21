import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GUTTER } from 'k2/app/modules/common/styles/vars';
import TransitionModal from 'k2/app/modules/common/components/modal/TransitionModal';
import { Button } from 'k2/app/modules/common/components/form';
import Fieldset from 'k2/app/modules/common/components/Fieldset';
import { backToDashboard, navigate, popToTop } from 'k2/app/navigation';
import Site from 'k2/app/modules/installation/models/Site';
import { get } from 'k2/app/container';
import { connect } from 'react-redux';
import {
  addInterventionToExistingReport,
  start,
} from 'k2/app/modules/intervention_report/actions/interventionReportActions';
import Intervention from 'k2/app/modules/intervention/models/Intervention';
import { PIPE_INTERVENTION_REPORT_SELECT_INTERVENTIONS } from 'k2/app/modules/intervention_report/constants';
import I18n from 'i18n-js';

class InterventionTransitionModal extends Component {
  static DURATION = 15; // 15 sec

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    children: PropTypes.node,
    icon: PropTypes.node,
    site: PropTypes.instanceOf(Site).isRequired,
    intervention: PropTypes.instanceOf(Intervention).isRequired,
    addToReport: PropTypes.func.isRequired,
    createReport: PropTypes.func.isRequired,
  };

  static defaultProps = {
    title: null,
    subtitle: null,
    children: null,
    icon: null,
  };

  static styles = {
    button: {
      flex: 0,
      marginTop: GUTTER,
    },
    fieldset: {
      flex: 0,
      width: '100%',
      padding: GUTTER,
    },
  };

  constructor(props) {
    super(props);

    this.interventionReportRepository = get('intervention_report_repository');
    this.transitionModaleRef = React.createRef();

    this.translations = I18n.t('components.intervention.transition_modale');

    this.onClose = this.onClose.bind(this);
    this.onCreateReport = this.onCreateReport.bind(this);
    this.onAddToReport = this.onAddToReport.bind(this);
    this.unregisterAutoClose = this.unregisterAutoClose.bind(this);
  }

  onClose() {
    this.unregisterAutoClose();
    backToDashboard();
  }

  onCreateReport() {
    const { createReport, site, intervention } = this.props;

    this.unregisterAutoClose();

    createReport(site, intervention.creation);
    popToTop();
    navigate(PIPE_INTERVENTION_REPORT_SELECT_INTERVENTIONS);
  }

  onAddToReport(report) {
    const { addToReport, intervention } = this.props;

    this.unregisterAutoClose();
    addToReport(intervention, report);
    this.onClose();
  }

  unregisterAutoClose() {
    this.transitionModaleRef.current.unregisterAutoClose();
  }

  /**
   * @returns {InterventionReport|null}
   */
  getOngoingReport() {
    const { site } = this.props;

    return this.interventionReportRepository.findLastBySiteAndDay(site);
  }

  render() {
    const { visible, title, subtitle, icon } = this.props;
    const { styles, DURATION } = this.constructor;
    const onGoingReport = this.getOngoingReport();

    return (
      <TransitionModal
        ref={this.transitionModaleRef}
        onClose={this.onClose}
        duration={DURATION}
        visible={visible}
        title={title}
        subtitle={subtitle}
        icon={icon}
      >
        <Fieldset title={this.translations.report_fieldset} style={styles.fieldset}>
          {onGoingReport && (
            <Button style={styles.button} onPress={() => this.onAddToReport(onGoingReport)}>
              {this.translations.add_to_report}
            </Button>
          )}
          <Button style={styles.button} onPress={this.onCreateReport}>
            {this.translations.create_report}
          </Button>
        </Fieldset>
      </TransitionModal>
    );
  }
}

export default connect(null, dispatch => ({
  addToReport: (...args) => dispatch(addInterventionToExistingReport(...args)),
  createReport: (...args) => dispatch(start(...args)),
}))(InterventionTransitionModal);
