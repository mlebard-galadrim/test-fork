import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { get } from 'k2/app/container';
import {
  TextInput,
  FloatInput,
  Select,
  DatePicker,
  ScanInput,
  Button,
  Switch,
} from 'k2/app/modules/common/components/form';
import Fieldset from 'k2/app/modules/common/components/Fieldset';
import Pressure from 'k2/app/modules/nomenclature/models/Pressure';
import { fixed, alphabetically } from 'k2/app/modules/common/utils/filterUtils';
import Installation from '../models/Installation';
import InterventionType from '../../intervention/models/InterventionType';
import UUID from 'react-native-uuid';

export default class InstallationForm extends Component {
  static propTypes = {
    onValidate: PropTypes.func.isRequired,
    onCreateIntervention: PropTypes.func.isRequired,
    installation: PropTypes.instanceOf(Installation),
  };

  static defaultProps = {
    installation: null,
  };

  static styles = {
    interventionButton: {
      maxWidth: 150,
    },
  };

  constructor(props) {
    super(props);

    this.translations = I18n.t('scenes.installation.installation');

    this.fluidRepository = get('fluid_repository');
    this.oilRepository = get('oil_repository');
    this.coolantRepository = get('coolant_repository');
    this.installationApplicationRepository = get('installation_application_repository');
    this.installationTechnologyRepository = get('installation_technology_repository');
    this.installationTypeRepository = get('installation_type_repository');

    this.installationApplicationOptions = Array.from(this.installationApplicationRepository.findAll());
    this.installationTechnologyOptions = Array.from(this.installationTechnologyRepository.findAll());
    this.installationTypeOptions = Array.from(this.installationTypeRepository.findAll());
    this.primaryFluidOptions = Array.from(this.fluidRepository.findAllForPrimaryCircuit());
    this.secondaryFluidOptions = Array.from(this.fluidRepository.findAll());
    this.primaryOilOptions = Array.from(this.oilRepository.findAll());
    this.secondaryOilOptions = Array.from(this.oilRepository.findAll());
    this.coolantOptions = Array.from(this.coolantRepository.findAll());

    const sortByDesignation = (a, b) => alphabetically(a.designation.toString(), b.designation.toString());

    // Sort technology options
    this.installationTechnologyOptions.sort(sortByDesignation);
    this.installationApplicationOptions.sort(sortByDesignation);
    this.installationTypeOptions.sort(sortByDesignation);

    const { installation } = props;

    this.state = {
      id: installation ? installation.id : UUID.v4(),
      name: installation ? installation.name : null,
      reference: installation ? installation.reference : null,
      barcode: installation ? installation.barcode : null,
      commissioningDate: installation ? installation.commissioningDate : null,
      lastLeakDetectionDate: installation ? installation.lastLeakDetectionDate : null,
      assemblyAt: installation?.assemblyAt ?? null,
      assemblyAtAlreadyFilled: Boolean(installation?.assemblyAt),
      disassemblyAt: installation?.disassemblyAt ?? null,
      disassemblyAtAlreadyFilled: Boolean(installation?.disassemblyAt),
      application: installation ? installation.application : null,
      technology: installation ? installation.technology : null,
      type: installation ? installation.type : null,
      nominalLoad: installation ? installation.primaryCircuit.nominalLoad : null,
      currentLoad: installation ? installation.primaryCircuit.currentLoad : null,
      primaryFluid: installation ? installation.primaryCircuit.fluid : null,
      primaryCircuitPressure: installation ? installation.primaryCircuit.pressure : null,
      primaryOil: installation ? installation.primaryCircuit.oil : null,
      primaryOilQuantity: installation ? installation.primaryCircuit.oilQuantity : null,
      primaryAntacid: installation ? installation.primaryCircuit.antacid : false,
      primaryOtherOilName:
        installation && installation.primaryCircuit.oil === null ? installation.primaryCircuit.otherOilName : null,
      secondaryFluid: installation && installation.secondaryCircuit ? installation.secondaryCircuit.fluid : null,
      secondaryOil: installation && installation.secondaryCircuit ? installation.secondaryCircuit.oil : null,
      coolant: installation ? installation.primaryCircuit.coolant : null,
      coolantQuantity: installation ? installation.primaryCircuit.coolantQuantity : null,
      coolantLevelPercent: installation ? installation.primaryCircuit.coolantLevelPercent : null,
      otherCoolantName:
        installation && installation.primaryCircuit.coolant === null
          ? installation.primaryCircuit.otherCoolantName
          : null,
      integratedLeakDetector: installation ? installation.integratedLeakDetector : false,
    };

    this.onValidate = this.onValidate.bind(this);
    this.onCommissioningDateChange = this.onCommissioningDateChange.bind(this);
    this.onLastLeakDetectionDateChange = this.onLastLeakDetectionDateChange.bind(this);
    this.onCoolantLevelPercentChange = this.onCoolantLevelPercentChange.bind(this);
    this.isComplete = this.isComplete.bind(this);
    this.handleCreateIntervention = this.handleCreateIntervention.bind(this);
    this.renderCreateAssemblyButton = this.renderCreateAssemblyButton.bind(this);
    this.renderCreateDisassemblyButton = this.renderCreateDisassemblyButton.bind(this);
  }

  /**
   * Create installation if has sufficient information
   */
  onValidate() {
    if (!this.isComplete()) {
      return;
    }

    this.props.onValidate(this.state);
  }

  /**
   *
   * @param {InterventionType} interventionType
   */
  handleCreateIntervention(interventionType) {
    this.props.onCreateIntervention(this.state, interventionType);
  }

  /**
   * @param {Date} date
   */
  onCommissioningDateChange(date) {
    this.setState({ commissioningDate: date });
  }

  /**
   * @param {Date|null} date
   */
  onLastLeakDetectionDateChange(date) {
    this.setState({ lastLeakDetectionDate: date });
  }

  /**
   *
   * @param {string} coolantLevelPercent
   */
  onCoolantLevelPercentChange(coolantLevelPercent) {
    this.setState({
      coolantLevelPercent: Math.min(Math.max(FloatInput.parse(coolantLevelPercent), 0), 100) || null,
    });
  }

  getNominalLoadError() {
    const { nominalLoad } = this.state;

    if (nominalLoad && isNaN(nominalLoad)) {
      return this.translations.errors.nominalLoadError;
    }

    return null;
  }

  getCurrentLoadError() {
    const { currentLoad } = this.state;

    if (currentLoad != null && isNaN(currentLoad)) {
      return this.translations.errors.currentLoadError;
    }

    return null;
  }

  getCurrentLoadWarning() {
    const { currentLoad, nominalLoad } = this.state;

    if (currentLoad != null && nominalLoad != null && parseFloat(currentLoad) > parseFloat(nominalLoad)) {
      return this.translations.errors.loadDiffError;
    }

    return null;
  }

  /**
   * Is the installation complete?
   *
   * @return {Boolean}
   */
  isComplete() {
    const { primaryFluid, reference, name } = this.state;

    return (
      primaryFluid !== null &&
      reference !== null &&
      name !== null &&
      this.getCurrentLoadError() === null &&
      this.getNominalLoadError() === null
    );
  }

  renderCreateAssemblyButton() {
    if (this.state.assemblyAtAlreadyFilled || this.state.disassemblyAtAlreadyFilled) {
      return null;
    }
    return (
      <Button
        valid={this.isComplete() && this.state.assemblyAt !== null && this.state.disassemblyAt === null}
        onPress={() => this.handleCreateIntervention(InterventionType.ASSEMBLY)}
        style={InstallationForm.styles.interventionButton}>
        {this.translations['assemblyAt:createIntervention']}
      </Button>
    );
  }

  renderCreateDisassemblyButton() {
    if (this.state.disassemblyAtAlreadyFilled) {
      return null;
    }
    return (
      <Button
        valid={this.isComplete() && this.state.disassemblyAt !== null}
        onPress={() => this.handleCreateIntervention(InterventionType.DISASSEMBLY)}
        style={InstallationForm.styles.interventionButton}>
        {this.translations['disassemblyAt:createIntervention']}
      </Button>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    return (
      <View>
        <Fieldset title={this.translations.fieldset.identification}>
          <TextInput
            title={this.translations.name}
            placeholder={this.translations.name}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
          />
          <TextInput
            title={this.translations.reference}
            placeholder={this.translations.reference}
            onChangeText={reference => this.setState({ reference })}
            value={this.state.reference}
          />
          <ScanInput
            title={this.translations.barcode}
            placeholder={this.translations.barcode}
            onChangeText={barcode => this.setState({ barcode })}
            defaultValue={this.state.barcode}
            optional
          />
        </Fieldset>
        <Fieldset title={this.translations.fieldset.primaryCircuit}>
          <Select
            title={this.translations.primaryFluid}
            placeholder={this.translations.primaryFluid}
            value={this.state.primaryFluid}
            options={this.primaryFluidOptions}
            renderOption={value => value.designation}
            onPressOption={primaryFluid => this.setState({ primaryFluid })}
          />
          <FloatInput
            title={this.translations.circuit.nominalLoad}
            placeholder={this.translations.circuit['nominalLoad:placeholder']}
            onChangeText={value => this.setState({ nominalLoad: FloatInput.parse(value) })}
            defaultValue={fixed(this.state.nominalLoad)}
            error={this.getNominalLoadError()}
            optional
          />
          <FloatInput
            title={this.translations.circuit.currentLoad}
            placeholder={this.translations.circuit['currentLoad:placeholder']}
            onChangeText={value => this.setState({ currentLoad: FloatInput.parse(value) })}
            defaultValue={fixed(this.state.currentLoad)}
            error={this.getCurrentLoadError()}
            warning={this.getCurrentLoadWarning()}
            optional
          />
          <Select
            title={this.translations.circuit.pressure}
            placeholder={this.translations.circuit['pressure:placeholder']}
            clearLabel={this.translations.circuit['pressure:placeholder']}
            options={Pressure.values}
            value={this.state.primaryCircuitPressure}
            renderOption={value => I18n.t(Pressure.readableFor(value))}
            onPressOption={primaryCircuitPressure => this.setState({ primaryCircuitPressure })}
            optional
          />
          <Select
            title={this.translations.primaryOil}
            placeholder={this.translations['oil:placeholder']}
            clearLabel={this.translations['oil:placeholder']}
            value={this.state.primaryOil}
            options={this.primaryOilOptions}
            renderOption={value => value.designation}
            onPressOption={primaryOil => this.setState({ primaryOil })}
            optional
          />
          {this.state.primaryOil === null ? (
            <TextInput
              title={this.translations.primaryOtherOilName}
              placeholder={this.translations.primaryOtherOilName}
              onChangeText={primaryOtherOilName => this.setState({ primaryOtherOilName })}
              value={this.state.primaryOtherOilName}
              optional
            />
          ) : null}
          <FloatInput
            title={this.translations.circuit.oilQuantity}
            placeholder={this.translations.circuit['oilQuantity:placeholder']}
            onChangeText={value => this.setState({ primaryOilQuantity: FloatInput.parse(value) })}
            defaultValue={fixed(this.state.primaryOilQuantity)}
            optional
          />
          <Switch
            title={this.translations.circuit.antacid}
            onValueChange={value => this.setState({ primaryAntacid: !!value })}
            value={this.state.primaryAntacid}
            optional
          />
          <Select
            title={this.translations.circuit.coolant}
            placeholder={this.translations.circuit.no_coolant}
            clearLabel={this.translations.circuit.no_coolant}
            value={this.state.coolant}
            options={this.coolantOptions}
            renderOption={value => value.designation.toString()}
            onPressOption={coolant => this.setState({ coolant })}
            optional
          />
          {this.state.coolant === null ? (
            <TextInput
              title={this.translations.circuit.otherCoolantName}
              placeholder={this.translations.circuit.otherCoolantName}
              onChangeText={otherCoolantName => this.setState({ otherCoolantName })}
              value={this.state.otherCoolantName}
              optional
            />
          ) : null}
          <FloatInput
            title={this.translations.circuit.coolantQuantity}
            placeholder={this.translations.circuit['coolantQuantity:placeholder']}
            onChangeText={value => this.setState({ coolantQuantity: FloatInput.parse(value) })}
            defaultValue={fixed(this.state.coolantQuantity)}
            optional
          />
          <FloatInput
            title={this.translations.circuit.coolantLevelPercent}
            placeholder={this.translations.circuit['coolantLevelPercent:placeholder']}
            onChangeText={this.onCoolantLevelPercentChange}
            value={this.state.coolantLevelPercent}
            unit="%"
            maxLength={3}
            optional
          />
        </Fieldset>
        <Fieldset title={this.translations.fieldset.secondaryCircuit}>
          <Select
            title={this.translations.secondaryFluid}
            placeholder={this.translations.secondaryFluid}
            value={this.state.secondaryFluid}
            options={this.secondaryFluidOptions}
            renderOption={value => value.designation}
            onPressOption={secondaryFluid => this.setState({ secondaryFluid })}
            optional
          />
          {this.state.secondaryFluid && (
            <Select
              title={this.translations.secondaryOil}
              placeholder={this.translations['oil:placeholder']}
              clearLabel={this.translations['oil:placeholder']}
              value={this.state.secondaryOil}
              options={this.secondaryOilOptions}
              renderOption={value => value.designation}
              onPressOption={secondaryOil => this.setState({ secondaryOil })}
              optional
            />
          )}
        </Fieldset>
        <Fieldset title={this.translations.fieldset.details}>
          <Select
            title={this.translations.application}
            placeholder={this.translations.application}
            value={this.state.application}
            options={this.installationApplicationOptions}
            renderOption={value => value.designation.toString()}
            onPressOption={application => this.setState({ application })}
            optional
          />
          <Select
            title={this.translations.technology}
            placeholder={this.translations.technology}
            value={this.state.technology}
            options={this.installationTechnologyOptions}
            renderOption={value => value.designation.toString()}
            onPressOption={technology => this.setState({ technology })}
            optional
          />
          <Select
            title={this.translations.type}
            placeholder={this.translations.type}
            value={this.state.type}
            options={this.installationTypeOptions}
            renderOption={value => value.designation.toString()}
            onPressOption={type => this.setState({ type })}
            optional
          />
          <DatePicker
            title={this.translations.commissioningDate}
            date={this.state.commissioningDate}
            onChange={this.onCommissioningDateChange}
            placeholder={this.translations.commissioningDate}
            allowClear
            optional
          />
          <DatePicker
            title={this.translations.lastLeakDetectionDate}
            date={this.state.lastLeakDetectionDate}
            onChange={this.onLastLeakDetectionDateChange}
            placeholder={this.translations.lastLeakDetectionDate}
            optional
          />
          <DatePicker
            title={this.translations.assemblyAt}
            date={this.state.assemblyAt}
            onChange={assemblyAt => {
              if (assemblyAt === null) {
                this.setState({ assemblyAtAlreadyFilled: false });
              }
              this.setState({ assemblyAt });
            }}
            placeholder={this.translations['assemblyAt:placeholder']}
            optional
            disabled={this.state.assemblyAtAlreadyFilled}
            allowClear
            RenderCustomAction={this.renderCreateAssemblyButton}
          />
          <DatePicker
            title={this.translations.disassemblyAt}
            date={this.state.disassemblyAt}
            onChange={disassemblyAt => {
              if (disassemblyAt === null) {
                this.setState({ disassemblyAtAlreadyFilled: false });
              }
              this.setState({ disassemblyAt });
            }}
            placeholder={this.translations['disassemblyAt:placeholder']}
            optional
            disabled={this.state.disassemblyAtAlreadyFilled}
            allowClear
            RenderCustomAction={this.renderCreateDisassemblyButton}
          />
          <Switch
            title={this.translations.integratedLeakDetector}
            onValueChange={value => this.setState({ integratedLeakDetector: !!value })}
            value={this.state.integratedLeakDetector}
            optional
          />
        </Fieldset>
        <Button valid={this.isComplete()} onPress={this.onValidate}>
          {I18n.t('common.submit')}
        </Button>
      </View>
    );
  }
}
