import AbstractImporter from 'k2/app/modules/common/api/importers/AbstractImporter';
import Analysis from '../../../analysis/models/Analysis';

class AnalysesImporter extends AbstractImporter {
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
    this.loadAnalysis = this.loadAnalysis.bind(this);
  }

  /**
   * Load analyses from API into the local database
   *
   * @param {Array} data
   *
   */
  load(data) {
    console.info('Loading analyses...');
    this.realm.write(() => {
      this.realm.delete(this.realm.objects(Analysis.schema.name));
      data.forEach(this.loadAnalysis);
    });
    console.info('Analyses loaded!');
  }

  loadAnalysis(data) {
    const object = Analysis.create(
      data.uuid,
      data.installationUuid,
      data.componentUuid,
      data.type,
      data.kitBarcode,
      data.createdAt,
      true,
    );

    return this.realm.create(Analysis.schema.name, object, true);
  }
}

export default AnalysesImporter;
