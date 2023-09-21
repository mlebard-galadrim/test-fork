import Enum from '../../common/models/Enum';

/**
 * Installation filter
 */
class InstallationFilter extends Enum {
  static LEAKING = 'leaking';

  static values = [InstallationFilter.LEAKING];

  static readables = {
    [InstallationFilter.LEAKING]: 'enum:installation_filter:leaking',
  };

  static isExcluding(value) {
    return value === this.LEAKING;
  }
}

export default InstallationFilter;
