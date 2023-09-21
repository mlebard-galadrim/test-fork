import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import View from 'k2/app/modules/common/components/View';
import I18n from 'i18n-js';
import Site from 'k2/app/modules/installation/models/Site';
import { Button, DatePicker, FloatInput, InformationField, TextInput } from 'k2/app/modules/common/components/form';
import Fieldset from 'k2/app/modules/common/components/Fieldset';
import { connect } from 'react-redux';
import Text from 'k2/app/modules/common/components/Text';
import { margin } from 'k2/app/modules/common/styles/utils';
import moment from 'moment';
import { setInfo } from 'k2/app/modules/intervention_report/actions/interventionReportActions';
import InterventionReport from 'k2/app/modules/intervention_report/model/InterventionReport';
import { PIPE_INTERVENTION_REPORT_SUP_UP } from 'k2/app/modules/intervention_report/constants';
import { navigate } from 'k2/app/navigation';

class InterventionReportInfo extends Component {
  static propTypes = {
    /** When editing an existing report */
    currentReport: PropTypes.instanceOf(InterventionReport),
    site: PropTypes.instanceOf(Site).isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    saveInfo: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentReport: null,
  };

  static styles = {
    wrapper: {
      flexDirection: 'column',
    },
    confirmButton: {
      flex: 0,
      borderRadius: 0,
    },
    caption: {
      ...margin(15, 0, 5, 10),
    },
  };

  constructor(props) {
    super(props);

    this.confirm = this.confirm.bind(this);
    this.computeInterventionNbHours = this.computeInterventionNbHours.bind(this);
    this.validate = this.validate.bind(this);
    this.onTimeChanged = this.onTimeChanged.bind(this);

    this.translations = I18n.t('scenes.intervention_report.report_info');

    const currentReport = props.currentReport;

    if (currentReport) {
      this.state = {
        reportNumber: currentReport.reportNumber,
        roundTripGoStartDate: currentReport.roundTripGoStartDate,
        roundTripGoEndDate: currentReport.roundTripGoEndDate,
        roundTripGoDistance: currentReport.roundTripGoDistance,
        roundTripReturnStartDate: currentReport.roundTripReturnStartDate,
        roundTripReturnEndDate: currentReport.roundTripReturnEndDate,
        roundTripReturnDistance: currentReport.roundTripReturnDistance,
        startDate: currentReport.startDate,
        endDate: currentReport.endDate,
      };
    } else {
      this.state = {
        reportNumber: null,
        roundTripGoStartDate: null,
        roundTripGoEndDate: null,
        roundTripGoDistance: null,
        roundTripReturnStartDate: null,
        roundTripReturnEndDate: null,
        roundTripReturnDistance: null,
        startDate: null,
        endDate: null,
      };
    }
  }

  computeInterventionNbHours() {
    const { startDate, endDate } = this.state;

    if ([startDate, endDate].includes(null) || !this.isDateRangeValid(startDate, endDate)) {
      return null;
    }

    return moment(endDate - startDate)
      .utc()
      .format(I18n.t('date.formats.time'));
  }

  validate() {
    const errors = {};
    const {
      startDate,
      endDate,
      roundTripGoStartDate,
      roundTripGoEndDate,
      roundTripReturnStartDate,
      roundTripReturnEndDate,
      roundTripGoDistance,
      roundTripReturnDistance,
    } = this.state;
    const errorTranslations = this.translations.form.errors;

    if (!this.isDateRangeValid(roundTripGoStartDate, roundTripGoEndDate)) {
      errors.roundTripGoEndDate = errorTranslations.date_range_invalid;
    }

    if (!this.isDateRangeValid(roundTripReturnStartDate, roundTripReturnEndDate)) {
      errors.roundTripReturnEndDate = errorTranslations.date_range_invalid;
    }

    if (!this.isDateRangeValid(startDate, endDate)) {
      errors.endDate = errorTranslations.date_range_invalid;
    }

    if (roundTripGoDistance !== null && roundTripGoDistance <= 0) {
      errors.roundTripGoDistance = errorTranslations.distance_greater_than_zero;
    }

    if (roundTripReturnDistance !== null && roundTripReturnDistance <= 0) {
      errors.roundTripReturnDistance = errorTranslations.distance_greater_than_zero;
    }

    return errors;
  }

  confirm() {
    const { next, date } = this.props;

    this.props.saveInfo({
      reportNumber: this.state.reportNumber,
      roundTripGoStartDate: this.getDayTime(date, this.state.roundTripGoStartDate),
      roundTripGoEndDate: this.getDayTime(date, this.state.roundTripGoEndDate),
      roundTripGoDistance: this.state.roundTripGoDistance,
      roundTripReturnStartDate: this.getDayTime(date, this.state.roundTripReturnStartDate),
      roundTripReturnEndDate: this.getDayTime(date, this.state.roundTripReturnEndDate),
      roundTripReturnDistance: this.state.roundTripReturnDistance,
      startDate: this.getDayTime(date, this.state.startDate),
      endDate: this.getDayTime(date, this.state.endDate),
    });

    next();
  }

  /**
   * @param {Boolean} strict Allow same date & time values
   */
  isDateRangeValid(startDate, endDate, strict = true) {
    if ([startDate, endDate].includes(null)) {
      return true;
    }

    const diff = endDate - startDate;

    return strict ? diff > 0 : diff >= 0;
  }

  onTimeChanged(property, newTime) {
    this.setState({
      [property]: this.getDayTime(this.props.date, newTime),
    });
  }

  /**
   * Ensures a time is relative to a referential day.
   *
   * @param {Date} day
   * @param {Date|null} time
   *
   * @returns {Date} The provided time set at given day
   */
  getDayTime(day, time) {
    if (time === null) {
      return null;
    }

    const dayTime = new Date(day.valueOf());

    dayTime.setHours(time.getHours(), time.getMinutes(), time.getSeconds());

    return dayTime;
  }

  render() {
    const { styles } = this.constructor;
    const errors = this.validate();

    return (
      <WrapperView full scrollable keyboardAware title={this.translations.title} style={styles.wrapper}>
        <View>
          <Fieldset title={this.translations.form.section.info}>
            <TextInput
              title={this.translations.form.reportNumber}
              placeholder={this.translations.form['reportNumber:placeholder']}
              onChangeText={v => this.setState({ reportNumber: v || null })}
              value={this.state.reportNumber}
              optional
            />
            <InformationField
              title={this.translations.form.date}
              placeholder={this.translations.form.date}
              value={this.props.date}
            />
            <InformationField
              title={this.translations.form.client}
              placeholder={this.translations.form.client}
              value={this.props.site.client.name}
            />
            <InformationField
              title={this.translations.form.site}
              placeholder={this.translations.form.site}
              value={`${this.props.site.name} - ${this.props.site.city}`}
            />
          </Fieldset>

          <Fieldset title={this.translations.form.section.round_trip}>
            <Text styleName="caption" style={styles.caption}>
              {this.translations.form.section.round_trip_go}
            </Text>

            <DatePicker
              title={this.translations.form.round_trip_start_date}
              onChange={d => this.onTimeChanged('roundTripGoStartDate', d)}
              date={this.state.roundTripGoStartDate}
              format="date.formats.time"
              mode="time"
              allowClear
              optional
            />
            <DatePicker
              title={this.translations.form.round_trip_end_date}
              onChange={d => this.onTimeChanged('roundTripGoEndDate', d)}
              date={this.state.roundTripGoEndDate}
              error={errors.roundTripGoEndDate}
              format="date.formats.time"
              mode="time"
              allowClear
              optional
            />

            <FloatInput
              title={this.translations.form.round_trip_distance}
              placeholder={I18n.t('common.not_provided')}
              onChangeText={v => this.setState({ roundTripGoDistance: FloatInput.parse(v, true) })}
              defaultValue={this.state.roundTripGoDistance}
              error={errors.roundTripGoDistance}
              unit={'km'}
              optional
            />

            <Text styleName="caption" style={styles.caption}>
              {this.translations.form.section.round_trip_return}
            </Text>

            <DatePicker
              title={this.translations.form.round_trip_start_date}
              onChange={d => this.onTimeChanged('roundTripReturnStartDate', d)}
              date={this.state.roundTripReturnStartDate}
              format="date.formats.time"
              mode="time"
              allowClear
              optional
            />
            <DatePicker
              title={this.translations.form.round_trip_end_date}
              onChange={d => this.onTimeChanged('roundTripReturnEndDate', d)}
              date={this.state.roundTripReturnEndDate}
              error={errors.roundTripReturnEndDate}
              format="date.formats.time"
              mode="time"
              allowClear
              optional
            />

            <FloatInput
              title={this.translations.form.round_trip_distance}
              placeholder={I18n.t('common.not_provided')}
              onChangeText={v => this.setState({ roundTripReturnDistance: FloatInput.parse(v, true) })}
              defaultValue={this.state.roundTripReturnDistance}
              error={errors.roundTripReturnDistance}
              optional
              unit={'km'}
            />
          </Fieldset>

          <Fieldset title={this.translations.form.section.interventions}>
            <DatePicker
              title={this.translations.form.interventions_start_date}
              date={this.state.startDate}
              format="date.formats.time"
              mode="time"
              allowClear
              optional
              onChange={d => this.onTimeChanged('startDate', d)}
            />
            <DatePicker
              title={this.translations.form.interventions_end_date}
              date={this.state.endDate}
              error={errors.endDate}
              format="date.formats.time"
              mode="time"
              allowClear
              optional
              onChange={d => this.onTimeChanged('endDate', d)}
            />

            <InformationField
              title={this.translations.form.interventions_nb_hours}
              value={this.computeInterventionNbHours()}
              placeholder={I18n.t('common.not_available')}
              unit={'h'}
            />
          </Fieldset>
        </View>

        <Button style={styles.confirmButton} onPress={this.confirm} valid={Object.keys(errors).length === 0}>
          {this.translations.confirm}
        </Button>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    currentReport: state.interventionReportReducer.currentReport,
    site: state.interventionReportReducer.site,
    date: state.interventionReportReducer.date,
    next: () => {
      navigate(PIPE_INTERVENTION_REPORT_SUP_UP);
    },
  }),
  dispatch => ({
    saveInfo: (...args) => dispatch(setInfo(...args)),
  }),
)(InterventionReportInfo);
