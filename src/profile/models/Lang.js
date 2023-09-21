import Enum from '../../common/models/Enum';

class Lang extends Enum {
  static FR = 'fr';
  static EN = 'en';
  static ES = 'es';
  static DE = 'de';
  static NL = 'nl';

  static values = [Lang.FR, Lang.EN, Lang.ES, Lang.DE, Lang.NL];

  /**
   * The ones actually selectable in the UI language picker
   */
  static selectables = Lang.values;

  static readables = {
    [Lang.FR]: 'Français',
    [Lang.EN]: 'English',
    [Lang.ES]: 'Español',
    [Lang.DE]: 'Deutsch',
    [Lang.NL]: 'Nederlands',
  };
}

export default Lang;
