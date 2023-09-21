import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { get } from 'k2/app/container';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import SelectMultipleList from 'k2/app/modules/common/components/form/SelectMultipleList';
import I18n from 'i18n-js';
import Site from 'k2/app/modules/installation/models/Site';
import { Button } from 'k2/app/modules/common/components/form';
import { reset, selectInterventions } from 'k2/app/modules/intervention_report/actions/interventionReportActions';
import Intervention from 'k2/app/modules/intervention/models/Intervention';
import { navigate } from 'k2/app/navigation';
import { PIPE_INTERVENTION_REPORT_SET_INFO } from 'k2/app/modules/intervention_report/constants';
import InterventionReport from 'k2/app/modules/intervention_report/model/InterventionReport';
import InterventionRow from 'k2/app/modules/intervention/components/InterventionRow';

/**
 * Select interventions to include in an intervention report.
 *
 * @property {InterventionRepository} interventionRepository
 */
class SelectInterventions extends Component {
  static propTypes = {
    /** When editing an existing report */
    currentReport: PropTypes.instanceOf(InterventionReport),
    site: PropTypes.instanceOf(Site).isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    selectInterventions: PropTypes.func.isRequired,
    preSelectedInterventions: PropTypes.arrayOf(PropTypes.instanceOf(Intervention)),
    onUnmount: PropTypes.func,
    next: PropTypes.func.isRequired,
  };

  static defaultProps = {
    preSelectedInterventions: null,
    onUnmount: null,
  };

  static styles = {
    wrapper: {
      flexDirection: 'column',
    },
    confirmButton: {
      flex: 0,
      borderRadius: 0,
    },
    list: {
      flex: 1,
    },
  };

  constructor(props) {
    super(props);

    this.interventionRepository = get('intervention_repository');

    this.getSelectableInterventions = this.getSelectableInterventions.bind(this);
    this.onChangedSelection = this.onChangedSelection.bind(this);
    this.canConfirm = this.canConfirm.bind(this);
    this.confirm = this.confirm.bind(this);

    this.state = {
      interventions: props.preSelectedInterventions || this.getSelectableInterventions(), // Select all by default
    };
  }

  componentWillUnmount() {
    this.props.onUnmount && this.props.onUnmount();
  }

  getSelectableInterventions() {
    if (this.options) {
      return this.options;
    }

    const { site, date, currentReport } = this.props;

    return (this.options = Array.from(this.interventionRepository.findBySiteAndDay(site, date, currentReport)));
  }

  onChangedSelection(selectedOptions) {
    this.setState({ interventions: selectedOptions });
  }

  canConfirm() {
    return this.state.interventions.length > 0;
  }

  confirm() {
    const { next } = this.props;
    const { interventions } = this.state;

    this.props.selectInterventions(interventions);

    next();
  }

  render() {
    const { styles } = this.constructor;
    const { interventions } = this.state;

    return (
      <WrapperView full title={I18n.t('scenes.intervention_report.select_interventions.title')} style={styles.wrapper}>
        <SelectMultipleList
          style={styles.list}
          renderOption={intervention => <InterventionRow intervention={intervention} />}
          onChangedSelection={this.onChangedSelection}
          options={this.getSelectableInterventions()}
          selectedOptions={interventions}
          compareItems={(a, b) => a.id === b.id}
        />

        <Button style={styles.confirmButton} onPress={this.confirm} valid={this.canConfirm()}>
          {I18n.t('scenes.intervention_report.select_interventions.confirm')}
        </Button>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    currentReport: state.interventionReportReducer.currentReport,
    preSelectedInterventions: state.interventionReportReducer.currentReport
      ? Array.from(state.interventionReportReducer.currentReport.interventions)
      : null,
    site: state.interventionReportReducer.site,
    date: state.interventionReportReducer.date,
    next: () => {
      navigate(PIPE_INTERVENTION_REPORT_SET_INFO);
    },
  }),
  dispatch => ({
    selectInterventions: interventions => dispatch(selectInterventions(interventions)),
    onUnmount: () => dispatch(reset()),
  }),
)(SelectInterventions);
