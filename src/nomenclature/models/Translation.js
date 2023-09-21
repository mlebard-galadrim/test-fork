import I18n from 'i18n-js';

class Translation {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String} property
   *
   * @return {Translation}
   */
  static create(value) {
    const instance = new this();

    instance.value = value;

    return instance;
  }

  /**
   * Set value for given locale
   *
   * @param  {String} locale
   * @param  {String} value
   */
  translate(locale, value = null) {
    this[locale] = value;
  }

  toString() {
    return this[I18n.locale] || this.value;
  }
}

Translation.schema = {
  name: 'Translation',
  properties: {
    value: 'string',
    en: 'string?',
    fr: 'string?',
    es: 'string?',
    de: 'string?',
    nl: 'string?',
  },
};

export default Translation;
