import React, { Component } from 'react';
import PropTypes from 'prop-types';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import View from 'k2/app/modules/common/components/View';
import I18n from 'i18n-js';
import Site from 'k2/app/modules/installation/models/Site';
import { Button, TextArea } from 'k2/app/modules/common/components/form';
import { connect } from 'react-redux';
import { save, setBillingSite } from 'k2/app/modules/intervention_report/actions/interventionReportActions';
import Intervention from 'k2/app/modules/intervention/models/Intervention';
import Fieldset from 'k2/app/modules/common/components/Fieldset';
import { Alert as RNAlert, Image, Switch } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import moment from 'moment';
import MainListView from 'k2/app/modules/common/components/list/MainListView';
import Definition from 'k2/app/modules/common/components/Definition';
import { COLOR_INFO, COLOR_PRIMARY, GUTTER } from 'k2/app/modules/common/styles/vars';
import SignatureBox from 'k2/app/modules/common/components/SignatureBox';
import { margin } from 'k2/app/modules/common/styles/utils';
import InterventionReport from 'k2/app/modules/intervention_report/model/InterventionReport';
import { backToDashboard } from 'k2/app/navigation';
import checkImage from 'k2/app/assets/icons/check.png';
import TransitionModal from 'k2/app/modules/common/components/modal/TransitionModal';
import InterventionRow from 'k2/app/modules/intervention/components/InterventionRow';
import Option from 'k2/app/modules/common/components/Option';
import selectBillingSite from 'k2/app/modules/intervention_report/navigation/selectBillingSiteNavigator';

class InterventionReportSumUp extends Component {
  static propTypes = {
    /** When editing an existing report */
    currentReport: PropTypes.instanceOf(InterventionReport),
    site: PropTypes.instanceOf(Site).isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    report: PropTypes.shape({
      reportNumber: PropTypes.string,
      interventions: PropTypes.arrayOf(PropTypes.instanceOf(Intervention)).isRequired,
      roundTripGoStartDate: PropTypes.instanceOf(Date),
      roundTripGoEndDate: PropTypes.instanceOf(Date),
      roundTripGoDistance: PropTypes.number,
      roundTripReturnStartDate: PropTypes.instanceOf(Date),
      roundTripReturnEndDate: PropTypes.instanceOf(Date),
      roundTripReturnDistance: PropTypes.number,
      startDate: PropTypes.instanceOf(Date),
      endDate: PropTypes.instanceOf(Date),
      billingSite: PropTypes.instanceOf(Site),
      comment: PropTypes.string,
      operatorSignature: PropTypes.string,
      clientSignature: PropTypes.string,
    }).isRequired,
    next: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    setBillingSite: PropTypes.func.isRequired,
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
      backgroundColor: COLOR_INFO,
    },
    terminateButton: {
      flex: 0,
      borderRadius: 0,
    },
    form: {
      flex: 1,
    },
    caption: {
      ...margin(5, 0),
    },
    input: {
      marginHorizontal: GUTTER,
    },
    signatures: {
      margin: GUTTER,
    },
    signature: {
      flex: 1,
      marginLeft: GUTTER / 2,
      marginRight: GUTTER / 2,
    },
    infoSection: {
      marginHorizontal: GUTTER,
      marginTop: 0,
      marginBottom: -10,
    },
    interventionsInfo: {
      marginHorizontal: GUTTER,
    },
    billingSite: {
      marginHorizontal: GUTTER,
    },
    switch: {
      flex: 0,
    },
  };

  constructor(props) {
    super(props);

    this.canConfirm = this.canConfirm.bind(this);
    this.confirm = this.confirm.bind(this);
    this.confirmCloseReport = this.confirmCloseReport.bind(this);
    this.renderInfo = this.renderInfo.bind(this);
    this.renderRoundTripInfo = this.renderRoundTripInfo.bind(this);
    this.renderInterventionsSection = this.renderInterventionsSection.bind(this);
    this.renderComment = this.renderComment.bind(this);
    this.renderSignatures = this.renderSignatures.bind(this);
    this.onConfirmModalClosed = this.onConfirmModalClosed.bind(this);
    this.onToggleBillingSiteSwitch = this.onToggleBillingSiteSwitch.bind(this);

    this.translations = I18n.t('scenes.intervention_report.sum_up');

    const currentReport = props.currentReport;

    if (currentReport) {
      this.state = {
        comment: currentReport.comment,
        operatorSignature: currentReport.operatorSignature,
        clientSignature: currentReport.clientSignature,
      };
    } else {
      this.state = {
        comment: null,
        operatorSignature: null,
        clientSignature: null,
      };
    }

    this.state.showConfirmModal = false;
  }

  canConfirm() {
    return this.state.operatorSignature !== null;
  }

  confirm(close = false) {
    this.props.save(
      {
        comment: this.state.comment,
        operatorSignature: this.state.operatorSignature,
        clientSignature: this.state.clientSignature,
      },
      close,
    );

    this.setState({ showConfirmModal: true });
  }

  /**
   * Ask the user confirmation about closing the report definitively.
   */
  confirmCloseReport() {
    RNAlert.alert(this.translations.close_confirm.title, this.translations.close_confirm.content, [
      { text: this.translations.close_confirm.close, style: 'destructive', onPress: () => this.confirm(true) },
      { text: I18n.t('common.cancel'), style: 'cancel' },
    ]);
  }

  onConfirmModalClosed() {
    this.props.next();
  }

  formatDate(date) {
    return moment(date).format(I18n.t('date.formats.moment_datepicker'));
  }

  formatTime(date) {
    return moment(date).format(I18n.t('date.formats.time'));
  }

  renderInfo() {
    const { report, date, site } = this.props;

    return [
      <Definition
        key={'reportNumber'}
        label={this.translations.form.reportNumber}
        value={report.reportNumber || this.translations.form['reportNumber:placeholder']}
      />,
      <Definition key={'date'} label={this.translations.form.date} value={this.formatDate(date)} />,
      <Definition key={'client'} label={this.translations.form.client} value={site.client.name} />,
      <Definition key={'site'} label={this.translations.form.site} value={`${site.name} - ${site.city}`} />,
    ];
  }

  renderRoundTripInfo() {
    const { styles } = this.constructor;
    const { report } = this.props;

    const info = [];

    if (report.roundTripGoStartDate || report.roundTripGoEndDate || report.roundTripGoDistance) {
      info.push(
        <Text styleName="caption" key="round_trip_go" style={styles.caption}>
          {this.translations.section.round_trip_go}
        </Text>,
      );
      report.roundTripGoStartDate &&
        info.push(
          <Definition
            key={'roundTripGoStartDate'}
            label={this.translations.form.round_trip_start_date}
            value={this.formatTime(report.roundTripGoStartDate)}
          />,
        );
      report.roundTripGoEndDate &&
        info.push(
          <Definition
            key={'roundTripGoEndDate'}
            label={this.translations.form.round_trip_end_date}
            value={this.formatTime(report.roundTripGoEndDate)}
          />,
        );
      report.roundTripGoDistance &&
        info.push(
          <Definition
            key={'roundTripGoDistance'}
            label={this.translations.form.round_trip_distance}
            value={`${report.roundTripGoDistance} km`}
          />,
        );
    }

    if (report.roundTripReturnStartDate || report.roundTripReturnEndDate || report.roundTripReturnDistance) {
      info.push(
        <Text styleName="caption" key="round_trip_return" style={styles.caption}>
          {this.translations.section.round_trip_return}
        </Text>,
      );
      report.roundTripReturnStartDate &&
        info.push(
          <Definition
            key={'roundTripReturnStartDate'}
            label={this.translations.form.round_trip_start_date}
            value={this.formatTime(report.roundTripReturnStartDate)}
          />,
        );
      report.roundTripReturnEndDate &&
        info.push(
          <Definition
            key={'roundTripReturnEndDate'}
            label={this.translations.form.round_trip_end_date}
            value={this.formatTime(report.roundTripReturnEndDate)}
          />,
        );
      report.roundTripReturnDistance &&
        info.push(
          <Definition
            key={'roundTripReturnDistance'}
            label={this.translations.form.round_trip_distance}
            value={`${report.roundTripReturnDistance} km`}
          />,
        );
    }

    return info.length > 0 ? (
      <Fieldset title={this.translations.section.round_trip} style={styles.infoSection}>
        {info}
      </Fieldset>
    ) : null;
  }

  renderComment() {
    const { styles } = this.constructor;
    const { comment } = this.state;

    return (
      <Fieldset title={this.translations.form.comment}>
        <TextArea
          placeholder={this.translations.form['comment:placeholder']}
          style={styles.input}
          defaultValue={comment}
          onChangeText={v => this.setState({ comment: v || null })}
          maxLength={255}
          returnKeyType="done"
        />
      </Fieldset>
    );
  }

  renderInterventionsSection() {
    const { styles } = this.constructor;
    const { report } = this.props;

    return (
      <Fieldset title={this.translations.section.interventions}>
        <View style={styles.interventionsInfo}>
          {report.startDate && (
            <Definition
              label={this.translations.form.interventions_start_date}
              value={this.formatTime(report.startDate)}
            />
          )}
          {report.endDate && (
            <Definition label={this.translations.form.interventions_end_date} value={this.formatTime(report.endDate)} />
          )}
        </View>

        <MainListView
          data={this.props.report.interventions}
          renderContent={intervention => <InterventionRow intervention={intervention} />}
          noDataContent="common.empty_list"
        />
      </Fieldset>
    );
  }

  onToggleBillingSiteSwitch() {
    const { report, setBillingSite: set } = this.props;
    const site = report.billingSite;
    // Clear or select billing site:
    site ? set(null) : selectBillingSite(set);
  }

  renderBillingSiteSection() {
    const { styles } = this.constructor;
    const { report } = this.props;
    const billingSite = report.billingSite;

    return (
      <Fieldset title={this.translations.section.billing_site}>
        <View style={styles.billingSite}>
          <Option
            label={this.translations.form.billing_site.same_as_intervention}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            <Switch
              style={styles.switch}
              trackColor={{ true: COLOR_PRIMARY }}
              value={billingSite === null}
              onValueChange={this.onToggleBillingSiteSwitch}
            />
          </Option>

          {billingSite && [
            <Definition key={'client'} label={this.translations.form.client} value={billingSite.client.name} />,
            <Definition
              key={'billingSite'}
              label={this.translations.form.site}
              value={`${billingSite.name} - ${billingSite.city}`}
            />,
          ]}
        </View>
      </Fieldset>
    );
  }

  renderSignatures() {
    const { styles } = this.constructor;

    return (
      <Fieldset title={this.translations.section.signatures}>
        <View styleName="horizontal" style={styles.signatures}>
          <View style={styles.signature}>
            <Text styleName="caption" style={styles.label}>
              {this.translations.form.operator_signature}
            </Text>
            <SignatureBox
              title={this.translations.form.operator_signature}
              onSignature={signature => this.setState({ operatorSignature: signature })}
              value={this.state.operatorSignature}
            />
          </View>
          <View style={styles.signature}>
            <Text styleName="caption" style={styles.label}>
              {this.translations.form.client_signature}
            </Text>
            <SignatureBox
              title={this.translations.form.client_signature}
              onSignature={signature => this.setState({ clientSignature: signature })}
              value={this.state.clientSignature}
            />
          </View>
        </View>
      </Fieldset>
    );
  }

  render() {
    const { styles } = this.constructor;

    return (
      <WrapperView full scrollable keyboardAware title={this.translations.title} style={styles.wrapper}>
        <View style={styles.form}>
          <Fieldset title={this.translations.section.info} style={styles.infoSection}>
            {this.renderInfo()}
          </Fieldset>
          {this.renderRoundTripInfo()}
          {this.renderBillingSiteSection()}
          {this.renderInterventionsSection()}
          {this.renderComment()}
          {this.renderSignatures()}
        </View>

        <Button style={styles.confirmButton} onPress={() => this.confirm(false)} valid={this.canConfirm()}>
          {this.translations.confirm}
        </Button>

        <Button style={styles.terminateButton} onPress={this.confirmCloseReport} valid={this.canConfirm()}>
          {this.translations.close}
        </Button>

        <TransitionModal
          onClose={this.onConfirmModalClosed}
          visible={this.state.showConfirmModal}
          title={this.translations.confirm_modal.title}
          subtitle={this.translations.confirm_modal.subtitle}
          icon={<Image style={styles.iconConfirm} source={checkImage} />}
        />
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    currentReport: state.interventionReportReducer.currentReport,
    report: state.interventionReportReducer,
    site: state.interventionReportReducer.site,
    date: state.interventionReportReducer.date,
    next: () => {
      backToDashboard();
    },
  }),
  dispatch => ({
    save: (...args) => dispatch(save(...args)),
    setBillingSite: billingSite => dispatch(setBillingSite(billingSite)),
  }),
)(InterventionReportSumUp);
