import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { navigate } from 'k2/app/navigation';
import { selectCircuit } from '../actions/installationPipe';
import WrapperView from '../../common/components/WrapperView';
import Definition from '../../common/components/Definition';
import InstallationModel from '../models/Installation';
import Fieldset from '../../common/components/Fieldset';
import { fixed } from '../../common/utils/filterUtils';
import { Button } from '../../common/components/form';
import Pressure from '../../nomenclature/models/Pressure';
import { PIPE_INSTALLATION_MANAGEMENT_EDIT } from '../constants';

class InstallationInfo extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    selectCircuit: PropTypes.func.isRequired,
    installation: PropTypes.instanceOf(InstallationModel),
  };

  static defaultProps = {
    installation: null,
  };

  static styles = {
    full: {
      marginVertical: 10,
    },
  };

  constructor() {
    super();

    this.translations = I18n.t('scenes.installation.installation');

    this.onEdit = this.onEdit.bind(this);
    this.goToComponentList = this.goToComponentList.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  shouldComponentUpdate(nextProps) {
    return nextProps.installation !== null;
  }

  /**
   * On edit installation
   */
  onEdit() {
    const { next } = this.props;

    navigate(PIPE_INSTALLATION_MANAGEMENT_EDIT, { next });
  }

  /**
   * Redirect to "Component list" scene
   */
  goToComponentList(circuit) {
    this.props.selectCircuit(circuit);
    this.props.next();
  }

  renderCircuit(circuit = null) {
    if (!circuit) {
      return null;
    }

    const { translations } = this;
    const componentsLength = circuit.components.length;
    const testID = circuit.isPrimary() ? 'primaryCircuit' : 'secondaryCircuit';

    return (
      <Fieldset
        testID={testID}
        title={I18n.t(`scenes.installation.installation.circuit.${circuit.isPrimary() ? 'primary' : 'secondary'}`)}>
        <Definition
          testID={`${testID}-fluid`}
          value={circuit.fluid && circuit.fluid.designation}
          label={translations.circuit.fluid}
        />
        {circuit.isPrimary() && (
          <Definition
            testID={`${testID}-currentLoad`}
            value={`${fixed(circuit.currentLoad)} kg`}
            label={translations.circuit.currentLoad}
          />
        )}
        {circuit.isPrimary() && (
          <Definition
            testID={`${testID}-nominalLoad`}
            value={`${fixed(circuit.nominalLoad)} kg`}
            label={translations.circuit.nominalLoad}
          />
        )}
        <Definition
          testID={`${testID}-oil`}
          value={(circuit.oil && circuit.oil.designation) || circuit.otherOilName || translations.circuit.no_oil}
          label={translations.circuit.oil}
        />
        {circuit.isPrimary() && (
          <Definition
            testID={`${testID}-oilQuantity`}
            value={`${fixed(circuit.oilQuantity)} kg`}
            label={translations.circuit.oilQuantity}
          />
        )}
        <Definition
          testID={`${testID}-coolant`}
          value={
            (circuit.coolant && circuit.coolant.designation.toString()) ||
            circuit.otherCoolantName ||
            translations.circuit.no_coolant
          }
          label={translations.circuit.coolant}
        />
        {circuit.isPrimary() && (
          <>
            <Definition
              testID={`${testID}-coolantQuantity`}
              value={`${fixed(circuit.coolantQuantity)} kg`}
              label={translations.circuit.coolantQuantity}
            />
            <Definition
              testID={`${testID}-coolantLevelPercent`}
              value={`${circuit.coolantLevelPercent}%`}
              label={translations.circuit.coolantLevelPercent}
            />
          </>
        )}
        {circuit.isPrimary() && (
          <Definition
            testID={`${testID}-pressure`}
            value={circuit.pressure && I18n.t(Pressure.readableFor(circuit.pressure))}
            label={translations.circuit.pressure}
          />
        )}
        {circuit.isPrimary() && (
          <Definition
            testID={`${testID}-antacid`}
            value={I18n.t(circuit.antacid ? 'common.yes' : 'common.no')}
            label={translations.circuit.antacid}
          />
        )}
        {circuit.isPrimary() && (
          <Definition
            testID={`${testID}-components`}
            value={`${componentsLength} ${translations.components[componentsLength > 1 ? 'plural' : 'single']}`}
            label={translations.circuit.title}
            linkTo={() => this.goToComponentList(circuit)}
          />
        )}
      </Fieldset>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { installation } = this.props;
    const { translations } = this;

    return (
      <WrapperView scrollable title={installation.name}>
        <Fieldset title={translations.fieldset.identification}>
          <Definition testID="name" value={installation.name} label={translations.name} />
          <Definition testID="reference" value={installation.reference} label={translations.reference} />
          {installation.barcode && (
            <Definition testID="barcode" value={installation.barcode} label={translations.barcode} />
          )}
        </Fieldset>
        {this.renderCircuit(installation.primaryCircuit)}
        {this.renderCircuit(installation.secondaryCircuit)}
        <Fieldset title={translations.fieldset.details}>
          <Definition
            testID="application"
            value={installation.application && installation.application.designation.toString()}
            label={translations.application}
          />
          <Definition
            testID="technology"
            value={installation.technology && installation.technology.designation.toString()}
            label={translations.technology}
          />
          <Definition
            testID="type"
            value={installation.type && installation.type.designation.toString()}
            label={translations.type}
          />
          <Definition
            testID="commissioningDate"
            value={I18n.l('date.formats.short', installation.commissioningDate)}
            label={translations.commissioningDate}
          />
          <Definition
            testID="assemblyAt"
            value={I18n.l('date.formats.short', installation.assemblyAt)}
            label={translations.assemblyAt}
          />
          <Definition
            testID="disassemblyAt"
            value={I18n.l('date.formats.short', installation.disassemblyAt)}
            label={translations.disassemblyAt}
          />
          <Definition
            testID="lastLeakDetectionDate"
            value={
              installation.lastLeakDetectionDate
                ? I18n.l('date.formats.short', installation.lastLeakDetectionDate)
                : I18n.t('common.unknown')
            }
            label={translations.lastLeakDetectionDate}
          />
          <Definition
            testID="integratedLeakDetector"
            value={installation.integratedLeakDetector ? I18n.t('common.yes') : I18n.t('common.no')}
            label={translations.integratedLeakDetector}
          />
        </Fieldset>
        <Button key="edit" onPress={this.onEdit} style={styles.full}>
          {I18n.t('common.edit')}
        </Button>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    installation: state.installationManagementReducer.installation,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    selectCircuit: circuit => dispatch(selectCircuit(circuit)),
  }),
)(InstallationInfo);
