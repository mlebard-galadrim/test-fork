import Enum from 'k2/app/modules/common/models/Enum';

class ClientType extends Enum {
  static COMPANY = 'company';

  static DO = 'DO';

  static CF = 'CF';

  static FINAL = 'final';

  static SERVICE_BENEFICIARY = 'service_beneficiary';

  static values = [ClientType.COMPANY, ClientType.CF, ClientType.DO, ClientType.FINAL, ClientType.SERVICE_BENEFICIARY];

  /**
   * @return {Boolean}
   */
  canHaveFinalClient() {
    return [ClientType.CF, ClientType.DO].includes(this.value);
  }
}

export default ClientType;
