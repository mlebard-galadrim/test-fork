export default class Contact {
  static schema = {
    name: 'Contact',
    properties: {
      firstname: 'string',
      lastname: 'string',
      email: 'string',
    },
  };

  /**
   * @param  {String} firstname
   * @param  {String} lastname
   * @param  {String} email
   *
   * @return {Contact}
   */
  static create(firstname, lastname, email) {
    const instance = new this();

    instance.firstname = firstname;
    instance.lastname = lastname;
    instance.email = email;

    return instance;
  }
}
