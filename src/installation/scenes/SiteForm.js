import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { TextInput, Select, Button } from 'k2/app/modules/common/components/form';
import Fieldset from 'k2/app/modules/common/components/Fieldset';
import Site from '../models/Site';

export default class SiteForm extends Component {
  static EMAIL_REGEX = /.+@.+\..+/;

  static propTypes = {
    onValidate: PropTypes.func.isRequired,
    site: PropTypes.instanceOf(Site),
  };

  static defaultProps = {
    site: null,
  };

  constructor(props) {
    super(props);

    this.translations = I18n.t('scenes.site_form');

    this.state = {
      type: 'none',
      designation: null,
      // Address:
      street: null,
      addressAddition: null,
      postal: null,
      city: null,
      country: null,
      // Manager:
      managerName: null,
      // Contact:
      contactLastname: null,
      contactFirstname: null,
      contactEmail: null,
    };

    this.isComplete = this.isComplete.bind(this);
    this.onValidate = this.onValidate.bind(this);
    this.isValidContact = this.isValidContact.bind(this);
    this.hasStartedFillingContact = this.hasStartedFillingContact.bind(this);
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

  hasManager() {
    return ['warehouse', 'treatment'].includes(this.state.type);
  }

  /**
   * Is the site complete?
   *
   * @return {Boolean}
   */
  isComplete() {
    const { type, designation, street, postal, city, country, managerName } = this.state;

    return (
      type !== null &&
      designation !== null &&
      street !== null &&
      city !== null &&
      postal !== null &&
      country !== null &&
      this.isValidContact() &&
      (!this.hasManager() || managerName !== null)
    );
  }

  /**
   * @returns {Boolean}
   */
  isValidContact() {
    const { contactLastname, contactFirstname, contactEmail } = this.state;

    if (!this.hasStartedFillingContact()) {
      return true;
    }

    return (
      // All contact fields filled
      ![contactLastname, contactFirstname, contactEmail].includes(null) &&
      // and contact email format valid
      this.isValidEmailFormat(contactEmail)
    );
  }

  /**
   * @returns {Boolean}
   */
  isValidEmailFormat(email) {
    return email === null || SiteForm.EMAIL_REGEX.test(email);
  }

  /**
   * @returns {Boolean} true if at least one of the contact field was filled
   */
  hasStartedFillingContact() {
    const { contactLastname, contactFirstname, contactEmail } = this.state;

    return !!(contactEmail || contactFirstname || contactLastname);
  }

  /**
   * {@inheritdoc}
   */
  render() {
    return (
      <View>
        <Fieldset title={this.translations.infos}>
          <TextInput
            title={this.translations.form.designation}
            placeholder={this.translations.form.designation}
            onChangeText={designation => this.setState({ designation: designation || null })}
            value={this.state.designation}
          />
          <Select
            title={this.translations.form.type}
            placeholder={this.translations.form.type}
            value={this.state.type}
            options={['treatment', 'warehouse', 'none']}
            renderOption={type => this.translations.form.types[type]}
            onPressOption={type => this.setState({ type })}
          />
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
        <Fieldset title={this.translations.contact}>
          <TextInput
            title={this.translations.form.contactLastname}
            placeholder={this.translations.form.contactLastname}
            onChangeText={contactLastname => this.setState({ contactLastname: contactLastname || null })}
            value={this.state.contactLastname}
            optional={!this.hasStartedFillingContact()}
            error={this.hasStartedFillingContact() && !this.state.contactLastname}
          />
          <TextInput
            title={this.translations.form.contactFirstname}
            placeholder={this.translations.form.contactFirstname}
            onChangeText={contactFirstname => this.setState({ contactFirstname: contactFirstname || null })}
            value={this.state.contactFirstname}
            optional={!this.hasStartedFillingContact()}
            error={this.hasStartedFillingContact() && !this.state.contactFirstname}
          />
          <TextInput
            title={this.translations.form.contactEmail}
            placeholder={this.translations.form.contactEmail}
            keyboardType="email-address"
            onChangeText={contactEmail => this.setState({ contactEmail: contactEmail || null })}
            value={this.state.contactEmail}
            optional={!this.hasStartedFillingContact()}
            error={
              (!this.isValidEmailFormat(this.state.contactEmail) && I18n.t('validator.common.email.invalid_format')) ||
              (this.hasStartedFillingContact() && !this.state.contactEmail)
            }
          />
        </Fieldset>
        {this.hasManager() && (
          <Fieldset title={this.translations.manager}>
            <TextInput
              title={this.translations.form.managerName}
              placeholder={this.translations.form.managerName}
              onChangeText={managerName => this.setState({ managerName: managerName || null })}
              value={this.state.managerName}
            />
          </Fieldset>
        )}
        <Button valid={this.isComplete()} onPress={this.onValidate}>
          {I18n.t('common.submit')}
        </Button>
      </View>
    );
  }
}
