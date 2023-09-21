import { get } from 'k2/app/container';
import { getCurrentLocale } from '../../../../I18n';
class AnalysisExporter {
  constructor() {
    this.analysisRepository = get('analysis_repository');

    this.getRaw = this.getRaw.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.clearUnSafeData = this.clearUnSafeData.bind(this);
    this.transformAnalysisToResource = this.transformAnalysisToResource.bind(this);
    this.finishExport = this.finishExport.bind(this);
  }

  getRaw() {
    const analyses = this.analysisRepository.findUnsynced();
    return { analyses: Array.from(analyses) };
  }

  retrieve() {
    const { analyses } = this.getRaw();

    return analyses.map(this.transformAnalysisToResource);
  }

  clearUnSafeData() {
    const { analyses } = this.getRaw();

    analyses.forEach(analysis => this.analysisRepository.delete(analysis));
  }

  /**
   * @param {Analysis} analysis
   *
   * @return {Object}
   */
  transformAnalysisToResource(analysis) {
    const resource = {
      type: 'analysis',
      data: {
        uuid: analysis.uuid,
        installation: analysis.installationUuid,
        component: analysis.componentUuid,
        type: analysis.type,
        kit: analysis.kitBarcode,
        createdAt: analysis.creation,
        appLanguage: getCurrentLocale(),
      },
    };

    return resource;
  }

  finishExport() {
    this.analysisRepository.markAllAsSynced();
  }
}

export default AnalysisExporter;
