import UsedKit from '../models/UsedKit';
import KitRange from '../models/KitRange';
import { shape, string, bool } from 'prop-types';
import { UpdateMode } from 'realm';

export const KitProp = shape({ barcode: string, used: bool });

/**
 * @typedef {Object} Kit
 * @property {string} barcode
 * @property {boolean} used
 */

class KitRepository {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    this.realm = realm;
  }

  isBarcodeAlreadyUsed(barcode) {
    const barcodeResult = this.realm.objects(UsedKit.schema.name).filtered('barcode == $0', barcode);
    return barcodeResult.length > 0;
  }

  doesKitExists(barcode) {
    return this.realm.objects(KitRange.schema.name).some(({ start, end }) => {
      return (
        barcode.length === start.length &&
        barcode.length === end.length &&
        start.localeCompare(barcode, 'en') <= 0 &&
        barcode.localeCompare(end, 'en') <= 0
      );
    });
  }

  /**
   * @param {String} barcode
   *
   * @return {Kit|null}
   */
  findByBarcode(barcode) {
    if (this.isBarcodeAlreadyUsed(barcode)) {
      return { barcode, used: true };
    }

    if (this.doesKitExists(barcode)) {
      return { barcode, used: false };
    }

    return null;
  }

  useKit(barcode) {
    this.realm.write(() => {
      this.realm.create(UsedKit.schema.name, UsedKit.createUsedKit(barcode), UpdateMode.Never);
    });
  }
}

export default KitRepository;
