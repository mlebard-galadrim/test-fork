import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { get } from 'k2/app/container';
import { TextInput, Select, Button, Switch } from 'k2/app/modules/common/components/form';
import Fieldset from 'k2/app/modules/common/components/Fieldset';
import ClientType from 'k2/app/modules/installation/models/ClientType';

export default class ClientForm extends Component {
  static SIRET_REGEX = /^((?:\s*\d){14})$/;

  static propTypes = {
    onValidate: PropTypes.func.isRequired,
    allowsIndividual: PropTypes.bool,
    needsSiret: PropTypes.bool,
    needsVatCode: PropTypes.bool,
    canUseVatCode: PropTypes.bool,
  };

  static defaultProps = {
    allowsIndividual: false,
    needsSiret: false,
    needsVatCode: false,
    canUseVatCode: false,
  };

  constructor(props) {
    super(props);

    this.translations = I18n.t('scenes.client_form');
    this.clientRepository = get('client_repository');

    this.state = {
      parent: null,
      legalCompanyName: null,
      individual: false,
      siret: null,
      vatCode: null,
      createSite: false,
      // Address:
      street: null,
      addressAddition: null,
      postal: null,
      city: null,
      country: null,
    };

    this.isComplete = this.isComplete.bind(this);
    this.onValidate = this.onValidate.bind(this);

    this.parentOptions = Array.from(this.clientRepository.findAllFromMyHierarchy()).filter(client =>
      new ClientType(client.type).canHaveFinalClient(),
    );
  }

  /**
   * Create installation if has sufficient information
   */
  onValidate() {
    if (!this.isComplete()) {
      return;
    }

    const payload = this.state;

    if (payload.individual) {
      delete payload.siret;
      delete payload.vatCode;
    }

    this.props.onValidate(payload);
  }

  /**
   * Is the client complete?
   *
   * @return {Boolean}
   */
  isComplete() {
    const { needsSiret, needsVatCode } = this.props;
    const { parent, legalCompanyName, siret, vatCode, street, city, postal, country, individual } = this.state;

    return (
      parent !== null &&
      legalCompanyName !== null &&
      street !== null &&
      city !== null &&
      postal !== null &&
      country !== null &&
      (individual ||
        // Check required siret or vat code for non individuals:
        ((!needsVatCode || vatCode !== null) && (!needsSiret || (siret !== null && this.isValidSiretFormat(siret)))))
    );
  }

  isValidSiretFormat(siret) {
    return siret === null || ClientForm.SIRET_REGEX.test(siret);
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { allowsIndividual, needsSiret, needsVatCode, canUseVatCode } = this.props;
    const { individual } = this.state;

    return (
      <View>
        <Fieldset title={this.translations.infos}>
          <Select
            title={this.translations.form.parent}
            placeholder={this.translations.form.parent}
            value={this.state.parent}
            options={this.parentOptions}
            renderOption={value => value.name}
            onPressOption={parent => this.setState({ parent })}
          />
          <TextInput
            title={this.translations.form.legalCompanyName}
            placeholder={this.translations.form.legalCompanyName}
            onChangeText={legalCompanyName => this.setState({ legalCompanyName: legalCompanyName || null })}
            value={this.state.legalCompanyName}
          />
          {allowsIndividual && (
            <Switch
              title={this.translations.form.individual}
              onValueChange={value => this.setState({ individual: !!value })}
              value={this.state.individual}
              optional
            />
          )}
          {needsSiret && !individual && (
            <TextInput
              title={this.translations.form.siret}
              placeholder={this.translations.form['siret:placeholder']}
              keyboardType="number-pad"
              onChangeText={siret => this.setState({ siret: siret || null })}
              value={this.state.siret}
              error={!this.isValidSiretFormat(this.state.siret) && I18n.t('validator.common.siret.invalid_format')}
            />
          )}
          {canUseVatCode && !individual && (
            <TextInput
              title={this.translations.form.vatCode}
              placeholder={this.translations.form.vatCode}
              onChangeText={vatCode => this.setState({ vatCode: vatCode || null })}
              value={this.state.vatCode}
              optional={!needsVatCode || individual}
            />
          )}
        </Fieldset>
        <Fieldset title={this.translations.address}>
          <TextInput
            title={this.translations.form.street}
            placeholder={this.translations.form.street}
            onChangeText={street => this.setState({ street: street || null })}
            value={this.state.street}
          />
          <TextInput
            title={this.translations.form.addressAddition}
            placeholder={this.translations.form.addressAddition}
            onChangeText={addressAddition => this.setState({ addressAddition: addressAddition || null })}
            value={this.state.addressAddition}
            optional
          />
          <TextInput
            title={this.translations.form.postal}
            placeholder={this.translations.form.postal}
            onChangeText={postal => this.setState({ postal: postal || null })}
            value={this.state.postal}
          />
          <TextInput
            title={this.translations.form.city}
            placeholder={this.translations.form.city}
            onChangeText={city => this.setState({ city: city || null })}
            value={this.state.city}
          />
          <TextInput
            title={this.translations.form.country}
            placeholder={this.translations.form.country}
            onChangeText={country => this.setState({ country: country || null })}
            value={this.state.country}
          />
        </Fieldset>
        <Fieldset title={this.translations.options}>
          <Switch
            title={this.translations.form.createSite}
            onValueChange={value => this.setState({ createSite: !!value })}
            value={this.state.createSite}
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
