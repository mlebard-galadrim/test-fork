import { get } from 'k2/app/container';

class InstallationExporter {
  constructor() {
    this.installationRepository = get('installation_repository');
    this.interventionRepository = get('intervention_repository');

    this.getRaw = this.getRaw.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.clearUnSafeData = this.clearUnSafeData.bind(this);
    this.transformInstallationToResource = this.transformInstallationToResource.bind(this);
    this.transformComponentToResource = this.transformComponentToResource.bind(this);
    this.transformCircuitToResource = this.transformCircuitToResource.bind(this);
    this.finishExport = this.finishExport.bind(this);
    this.computeDisassemblyAt = this.computeDisassemblyAt.bind(this);
  }

  getRaw() {
    const installations = this.installationRepository.findUnsynced();

    return { installations };
  }

  retrieve() {
    const { installations } = this.getRaw();

    return installations.map(this.transformInstallationToResource);
  }

  clearUnSafeData() {
    const installations = this.installationRepository.findUnsynced();

    installations.forEach(installation => this.installationRepository.delete(installation));
  }

  /**
   * disassemblyAt !== null and pending intervention implies there is a disassembly intervention
   * @param {Installation} installation
   * @returns {string|null}
   */
  computeDisassemblyAt(installation) {
    if (installation.disassemblyAt) {
      if (this.interventionRepository.findUnsynced(installation.id).length > 0) {
        return null;
      }
      return installation.disassemblyAt.toISOString();
    }
    return null;
  }

  transformInstallationToResource(installation) {
    const {
      id,
      name,
      reference,
      barcode,
      site,
      circuits,
      type,
      technology,
      application,
      commissioningDate,
      integratedLeakDetector,
      lastLeakDetectionDate,
      assemblyAt,
    } = installation;
    const resource = { type: 'installation' };

    resource.data = {
      id,
      name,
      reference,
      barcode,
      site: site.id,
      circuits: Array.from(circuits).map(this.transformCircuitToResource),
      type: type ? type.uuid : null,
      technology: technology ? technology.uuid : null,
      application: application ? application.uuid : null,
      commissioningDate: commissioningDate ? commissioningDate.toISOString() : null,
      integratedLeakDetector,
      lastLeakDetectionDate: lastLeakDetectionDate ? lastLeakDetectionDate.toISOString() : null,
      assemblyAt: assemblyAt ? assemblyAt.toISOString() : null,
      disassemblyAt: this.computeDisassemblyAt(installation),
    };
    return resource;
  }

  /**
   * @param {Component} component
   */
  transformComponentToResource(component) {
    const {
      uuid,
      nature,
      designation,
      mark,
      barcode,
      natureClassification,
      natureType,
      commissioningDate,
      brand,
      brandOther,
      model,
      modelOther,
      serialNumber,
      usagePercent,
    } = component;

    return {
      uuid,
      nature: nature.uuid,
      designation,
      mark,
      barcode,
      natureClassification: natureClassification ? natureClassification.uuid : null,
      natureType: natureType ? natureType.uuid : null,
      commissioningDate: commissioningDate ? commissioningDate.toISOString() : null,
      brand: brand ? brand.uuid : null,
      brandOther,
      model,
      modelOther,
      serialNumber,
      usagePercent,
    };
  }

  /**
   * @param {Circuit} circuit
   */
  transformCircuitToResource(circuit) {
    const {
      id,
      index,
      components,
      fluid,
      currentLoad,
      nominalLoad,
      oil,
      oilQuantity,
      coolant,
      coolantQuantity,
      coolantLevelPercent,
      otherCoolantName,
      pressure,
      antacid,
      otherOilName,
    } = circuit;

    return {
      id,
      number: index + 1,
      components: Array.from(components).map(this.transformComponentToResource),
      fluid: fluid.uuid,
      currentLoad,
      nominalLoad,
      oil: oil ? oil.uuid : null,
      oilQuantity,
      coolant: coolant ? coolant.uuid : null,
      coolantQuantity,
      coolantLevelPercent,
      otherCoolantName,
      pressure,
      antacid,
      otherOilName,
    };
  }

  finishExport() {
    this.installationRepository.markAllAsSynced();
  }
}

export default InstallationExporter;
