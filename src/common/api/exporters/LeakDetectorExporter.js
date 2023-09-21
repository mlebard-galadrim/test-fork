import { get } from 'k2/app/container';

class LeakDetectorExporter {
  constructor() {
    this.detectorRepository = get('detector_repository');

    this.getRaw = this.getRaw.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.clearUnSafeData = this.clearUnSafeData.bind(this);
    this.transformDetectorToResource = this.transformDetectorToResource.bind(this);
    this.finishExport = this.finishExport.bind(this);
  }

  getRaw() {
    const detectors = this.detectorRepository.findUnsynced();

    return { detectors };
  }

  retrieve() {
    const { detectors } = this.getRaw();

    return detectors.map(this.transformDetectorToResource);
  }

  clearUnSafeData() {
    const { detectors } = this.getRaw();

    detectors.forEach(detector => this.detectorRepository.delete(detector));
  }

  /**
   * @param {Detector} detector
   *
   * @return {Object}
   */
  transformDetectorToResource(detector) {
    const resource = { type: 'leak_detector' };

    resource.data = {
      uuid: detector.id,
      clientUuid: detector.client.id,
      designation: detector.designation,
      serialNumber: detector.serialNumber,
      barcode: detector.barcode,
      mark: detector.mark,
      lastInspectionDate: detector.lastInspectionDate.toISOString(),
    };

    return resource;
  }

  finishExport() {
    this.detectorRepository.markAllAsSynced();
  }
}

export default LeakDetectorExporter;
