import AbstractImporter from 'k2/app/modules/common/api/importers/AbstractImporter';
import UsedKit from '../../../analysis/models/UsedKit';
import KitRange from '../../../analysis/models/KitRange';
import { UpdateMode } from 'realm';

class KitsImporter extends AbstractImporter {
  /**
   * @type {Realm}
   */
  realm;

  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm);

    this.load = this.load.bind(this);
    this.loadKit = this.loadKit.bind(this);
    this.loadKitRange = this.loadKitRange.bind(this);
  }

  /**
   * Load kits from API into the database
   *
   * @param {{usedKits: Array<UsedKit>, kitRanges: Array<{start: string, end: string}>}} data
   *
   */
  load(data) {
    const { usedKits, kitRanges } = data;
    console.info('Loading kits...');
    this.realm.write(() => {
      this.realm.delete(this.realm.objects(UsedKit.schema.name));
      this.realm.delete(this.realm.objects(KitRange.schema.name));
      usedKits.forEach(this.loadKit);
      kitRanges.forEach(this.loadKitRange);
    });
    console.info('Kits loaded!');
  }

  /**
   * @param {{barcode: string}} data
   */
  loadKit(data) {
    const object = UsedKit.fromApi(data.barcode);

    return this.realm.create(UsedKit.schema.name, object, UpdateMode.Never);
  }

  /**
   *
   * @param {{start: string, end: string}} data
   */
  loadKitRange(data) {
    const { start, end } = data;
    const object = KitRange.fromApi(start, end);

    return this.realm.create(KitRange.schema.name, object, UpdateMode.Never);
  }
}

export default KitsImporter;
