import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView } from 'react-native';
import { get } from 'k2/app/container';
import ComponentBrand from 'k2/app/modules/nomenclature/models/ComponentBrand';
import { TextInput, FloatInput, Select, DatePicker, ScanInput, Button } from 'k2/app/modules/common/components/form';
import Fieldset from 'k2/app/modules/common/components/Fieldset';
import { GUTTER, COLOR_ERROR } from 'k2/app/modules/common/styles/vars';
import ComponentModel from '../models/Component';

class ComponentForm extends Component {
  static propTypes = {
    onValidate: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    model: PropTypes.instanceOf(ComponentModel),
  };

  static defaultProps = {
    model: null,
    onDelete: null,
  };

  static styles = {
    button: {
      margin: GUTTER,
    },
    delete: {
      backgroundColor: COLOR_ERROR,
      borderColor: COLOR_ERROR,
      marginTop: 0,
    },
  };

  constructor(props) {
    super(props);

    const { model } = props;

    this.state = {
      barcode: model ? model.barcode : null,
      nature: model ? model.nature : null,
      designation: model ? model.designation : null,
      mark: model ? model.mark : null,
      natureClassification: model ? model.natureClassification : null,
      natureType: model ? model.natureType : null,
      commissioningDate: model ? model.commissioningDate : null,
      brand: model ? model.brand : null,
      model: model ? model.model : null,
      serialNumber: model ? model.serialNumber : null,
      usagePercent: model ? model.usagePercent : null,
    };

    this.componentNatureRepository = get('component_nature_repository');
    this.componentNatureClassificationRepository = get('component_nature_classification_repository');
    this.componentNatureTypeRepository = get('component_nature_type_repository');
    this.componentBrandRepository = get('component_brand_repository');

    this.natureOptions = this.getNatureOptions();
    this.natureClassificationOptions = this.getComponentNatureClassificationOptions(this.state.nature);
    this.natureTypeOptions = this.getNatureTypeOptions(this.state.nature);
    this.brandOptions = this.getBrandOptions();

    this.onSubmit = this.onSubmit.bind(this);
    this.setTimeOfUse = this.setTimeOfUse.bind(this);
    this.isComplete = this.isComplete.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  componentDidUpdate(prevProps, prevState) {
    const { nature } = this.state;

    // Get new data from Realm if component nature is changed
    if ((prevState.nature && prevState.nature.uuid) !== (nature && nature.uuid)) {
      this.natureClassificationOptions = this.getComponentNatureClassificationOptions(nature);
      this.natureTypeOptions = this.getNatureTypeOptions(nature);

      this.setState({
        natureClassification: null,
        natureType: null,
      });
    }
  }

  /**
   * Submit form
   */
  onSubmit() {
    if (!this.isComplete()) {
      return;
    }

    const { brand, ...model } = this.state;
    const isBrand = brand && brand instanceof ComponentBrand;

    this.props.onValidate({
      ...model,
      brand: isBrand ? brand : null,
      brandOther: isBrand ? null : brand,
    });
  }

  /**
   * @return {Array}
   */
  getNatureOptions() {
    return Array.from(this.componentNatureRepository.findAll());
  }

  /**
   * @param {ComponentNature} nature
   *
   * @return {Array}
   */
  getComponentNatureClassificationOptions(nature = null) {
    if (!nature) {
      return [];
    }

    return Array.from(this.componentNatureClassificationRepository.findByNature(nature));
  }

  /**
   * @param {ComponentNature} nature
   *
   * @return {Array}
   */
  getNatureTypeOptions(nature = null) {
    if (!nature) {
      return [];
    }

    return Array.from(this.componentNatureTypeRepository.findByNature(nature));
  }

  /**
   * @return {Array}
   */
  getBrandOptions() {
    return Array.from(this.componentBrandRepository.findAll()).concat([I18n.t('common.other')]);
  }

  /**
   * @param {String} value
   */
  setTimeOfUse(value) {
    return this.setState({
      usagePercent: Math.min(Math.max(FloatInput.parse(value), 0), 100) || null,
    });
  }

  /**
   * Is the component form complete?
   *
   * @return {Boolean}
   */
  isComplete() {
    const { nature } = this.state;

    return nature !== null;
  }

  /**
   * @param {ComponentBrand|String|null} brand
   */
  renderBrandOption(brand) {
    if (brand && brand instanceof ComponentBrand) {
      return brand.designation;
    }

    return brand;
  }

  renderDelete() {
    const { onDelete } = this.props;
    const { styles } = ComponentForm;

    if (!onDelete) {
      return null;
    }

    return (
      <Button style={{ ...styles.button, ...styles.delete }} onPress={onDelete}>
        {I18n.t('common.delete')}
      </Button>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = ComponentForm;

    return (
      <KeyboardAvoidingView>
        <Fieldset title={I18n.t('scenes.installation.installation.add_component.fieldset:id')}>
          <TextInput
            title={I18n.t('scenes.installation.installation.add_component.designation')}
            placeholder={I18n.t('scenes.installation.installation.add_component.designation:placeholder')}
            onChangeText={designation => this.setState({ designation })}
            value={this.state.designation}
            optional
          />
          <TextInput
            title={I18n.t('scenes.installation.installation.add_component.mark')}
            placeholder={I18n.t('scenes.installation.installation.add_component.mark:placeholder')}
            onChangeText={mark => this.setState({ mark })}
            value={this.state.mark}
            optional
          />
          <ScanInput
            title={I18n.t('scenes.installation.installation.add_component.code')}
            placeholder={I18n.t('scenes.installation.installation.add_component.code:placeholder')}
            onChangeText={barcode => this.setState({ barcode })}
            defaultValue={this.state.barcode}
            optional
          />
          <TextInput
            title={I18n.t('scenes.installation.installation.add_component.serialNumber')}
            placeholder={I18n.t('scenes.installation.installation.add_component.serialNumber:placeholder')}
            onChangeText={serialNumber => this.setState({ serialNumber })}
            value={this.state.serialNumber}
            optional
          />
        </Fieldset>
        <Fieldset title={I18n.t('scenes.installation.installation.add_component.fieldset:details')}>
          <Select
            title={I18n.t('scenes.installation.installation.add_component.nature')}
            placeholder={I18n.t('scenes.installation.installation.add_component.nature:placeholder')}
            value={this.state.nature}
            options={this.natureOptions}
            onPressOption={nature => this.setState({ nature })}
            renderOption={value => value.designation.toString()}
          />
          {this.state.nature && this.state.nature.uuid === '1' && (
            <FloatInput
              title={I18n.t('scenes.installation.installation.add_component.usagePercent')}
              placeholder={I18n.t('scenes.installation.installation.add_component.timeOfUse:placeholder')}
              onChangeText={this.setTimeOfUse}
              value={this.state.usagePercent}
              unit="%"
              maxLength={3}
              optional
            />
          )}
          <Select
            title={I18n.t('scenes.installation.installation.add_component.classification')}
            placeholder={I18n.t('scenes.installation.installation.add_component.classification:placeholder')}
            value={this.state.natureClassification}
            options={this.natureClassificationOptions}
            renderOption={value => value.designation.toString()}
            onPressOption={natureClassification => this.setState({ natureClassification })}
            optional
          />
          <Select
            title={I18n.t('scenes.installation.installation.add_component.type')}
            placeholder={I18n.t('scenes.installation.installation.add_component.type:placeholder')}
            value={this.state.natureType}
            options={this.natureTypeOptions}
            renderOption={value => value.designation.toString()}
            onPressOption={natureType => this.setState({ natureType })}
            optional
          />
          <Select
            title={I18n.t('scenes.installation.installation.add_component.brand')}
            placeholder={I18n.t('scenes.installation.installation.add_component.brand:placeholder')}
            value={this.state.brand}
            options={this.brandOptions}
            renderOption={this.renderBrandOption}
            onPressOption={brand => this.setState({ brand })}
            optional
          />
          <TextInput
            title={I18n.t('scenes.installation.installation.add_component.model')}
            placeholder={I18n.t('scenes.installation.installation.add_component.model:placeholder')}
            onChangeText={model => this.setState({ model: model || null })}
            value={this.state.model}
            optional
          />
          <DatePicker
            title={I18n.t('scenes.installation.installation.add_component.commissioningDate')}
            date={this.state.commissioningDate}
            onChange={commissioningDate => this.setState({ commissioningDate })}
            placeholder={I18n.t('scenes.installation.installation.add_component.commissioningDate:placeholder')}
            optional
          />
        </Fieldset>
        <Button style={styles.button} valid={this.isComplete()} onPress={this.onSubmit}>
          {I18n.t('common.submit')}
        </Button>
        {this.renderDelete()}
      </KeyboardAvoidingView>
    );
  }
}

export default ComponentForm;
