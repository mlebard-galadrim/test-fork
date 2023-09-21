import { get } from 'k2/app/container';
import Client from '../../../installation/models/Client';
import CertificateOfProfessionalCompetence from '../../../installation/models/CertificateOfProfessionalCompetence';
import Site from '../../../installation/models/Site';
import Installation from '../../../installation/models/Installation';
import Circuit from '../../../installation/models/Circuit';
import Component from '../../../installation/models/Component';
import Leak from '../../../intervention/models/Leak';
import Carrier from '../../../shipping/models/Carrier';
import Detector from '../../../detector/models/Detector';
import AbstractImporter from 'k2/app/modules/common/api/importers/AbstractImporter';

/**
 * Import the full Client tree (Client, Site, Installation and Component)
 */
class ClientTreeImporter extends AbstractImporter {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm);

    this.clientRepository = get('client_repository');
    this.siteRepository = get('site_repository');
    this.installationRepository = get('installation_repository');
    this.circuitRepository = get('circuit_repository');
    this.componentRepository = get('component_repository');
    this.componentBrandRepository = get('component_brand_repository');
    this.componentNatureRepository = get('component_nature_repository');
    this.componentNatureTypeRepository = get('component_nature_type_repository');
    this.componentNatureClassificationRepository = get('component_nature_classification_repository');
    this.installationTechnologyRepository = get('installation_technology_repository');
    this.installationApplicationRepository = get('installation_application_repository');
    this.installationTypeRepository = get('installation_type_repository');
    this.fluidRepository = get('fluid_repository');
    this.oilRepository = get('oil_repository');
    this.coolantRepository = get('coolant_repository');

    this.load = this.load.bind(this);
    this.loadClient = this.loadClient.bind(this);
    this.loadSite = this.loadSite.bind(this);
    this.loadInstallation = this.loadInstallation.bind(this);
    this.loadCircuit = this.loadCircuit.bind(this);
    this.loadComponent = this.loadComponent.bind(this);
    this.loadLeak = this.loadLeak.bind(this);
  }

  /**
   * Load client tree from API into the database
   *
   * @param {Array} data
   */
  load(data) {
    console.info('Loading client tree...');

    const clients = data;
    console.debug('Compute payload sites objects');
    const sites = data.reduce((accumulator, client) => accumulator.concat(client.sites), []);
    console.debug('Compute payload installations objects');
    const installations = sites.reduce((accumulator, site) => accumulator.concat(site.installations), []);
    console.debug('Compute payload circuits objects');
    const circuits = installations.reduce((accumulator, installation) => {
      if (installation.primaryCircuit) {
        accumulator.push({
          id: `${installation.uuid}-0`,
          ...installation.primaryCircuit,
        });
      }
      if (installation.secondaryCircuit) {
        accumulator.push({
          id: `${installation.uuid}-1`,
          ...installation.secondaryCircuit,
        });
      }

      return accumulator;
    }, []);
    console.debug('Compute payload components objects');
    const components = circuits.reduce((accumulator, circuit) => accumulator.concat(circuit.components), []);

    console.debug("All payload objects computed. Let's write now...");

    this.realm.write(() => {
      console.debug('Removing client stale objects');
      // Removing objects carefully to prevent dropping containers foreign key on partial sync:
      this.removeStaleObjects(this.clientRepository, 'uuid', clients);
      console.debug('Removing sites stale objects');
      this.removeStaleObjects(this.siteRepository, 'uuid', sites);
      console.debug('Removing installs stale objects');
      this.removeStaleObjects(this.installationRepository, 'uuid', installations);
      console.debug('Removing circuits stale objects');
      this.removeStaleObjects(this.circuitRepository, 'id', circuits);
      console.debug('Removing components stale objects');
      this.removeStaleObjects(this.componentRepository, 'uuid', components);

      // Other objects can be safely deleted:
      console.debug('Removing carriers & detectors stale objects');
      this.realm.delete(this.realm.objects(Carrier.schema.name));
      this.realm.delete(this.realm.objects(Detector.schema.name));

      console.debug('Do load clients...');
      data.forEach(this.loadClient);
    });
    console.info('Client tree loaded!');
  }

  loadClient(data) {
    const {
      uuid,
      fullExternalId,
      legalCompanyName,
      sites,
      carriers,
      type,
      leakDetectors,
      distributor,
      certificateOfProfessionalCompetence,
      partOfMyHierarchy,
    } = data;
    let copc = null;

    if (certificateOfProfessionalCompetence) {
      const { number, startDate, endDate } = certificateOfProfessionalCompetence;

      copc = CertificateOfProfessionalCompetence.create(number, new Date(startDate), new Date(endDate));
    }

    const object = Client.create(
      uuid,
      fullExternalId,
      legalCompanyName,
      type,
      [],
      distributor,
      copc,
      partOfMyHierarchy,
      true,
    );
    const client = this.realm.create(Client.schema.name, object, true);

    client.sites = sites.map(site => this.loadSite(client, site));
    carriers.forEach(carrier => this.loadCarrier(client, carrier));
    leakDetectors.forEach(leakDetector => this.loadDetector(client, leakDetector));

    return client;
  }

  loadCarrier(client, data) {
    const { uuid, legalCompanyName, address, transportAuthorization } = data;
    const { city } = address;
    const object = Carrier.create(
      uuid,
      legalCompanyName,
      city,
      client,
      new Date(transportAuthorization.expirationDate),
    );

    return this.realm.create(Carrier.schema.name, object, true);
  }

  loadDetector(client, data) {
    const { uuid, designation, serialNumber, barcode, lastInspectionDate, mark } = data;
    const object = Detector.create(
      uuid,
      client,
      designation,
      serialNumber,
      barcode,
      new Date(lastInspectionDate),
      mark,
      true,
    );

    return this.realm.create(Detector.schema.name, object, true);
  }

  loadSite(client, data) {
    const { uuid, designation, address, installations, treatmentSite, warehouse } = data;
    const { city, latitude, longitude } = address || {};
    const object = Site.create(
      uuid,
      designation,
      city || null,
      client,
      latitude ? parseFloat(latitude) : null,
      longitude ? parseFloat(longitude) : null,
      treatmentSite,
      warehouse,
      [],
      true,
    );
    const site = this.realm.create(Site.schema.name, object, true);

    site.installations = (installations || []).map(installation => this.loadInstallation(site, installation));

    return site;
  }

  loadInstallation(site, data) {
    const {
      uuid,
      mark,
      barcode,
      designation,
      primaryCircuit,
      secondaryCircuit,
      commissioningDate,
      applicationUuid,
      technologyUuid,
      typeUuid,
      leaks,
      integratedLeakDetector,
      lastLeakDetectionDate,
      assemblyAt,
      disassemblyAt,
      deleted: isDeleted, // TODO: figure out why the endpoint sends back "deleted" instead of "isDeleted".
    } = data;

    const object = Installation.create(
      uuid,
      mark,
      barcode,
      designation,
      site,
      technologyUuid ? this.installationTechnologyRepository.find(technologyUuid) : null,
      applicationUuid ? this.installationApplicationRepository.find(applicationUuid) : null,
      commissioningDate ? new Date(commissioningDate) : null,
      [],
      leaks.map(this.loadLeak),
      typeUuid ? this.installationTypeRepository.find(typeUuid) : null,
      true,
      integratedLeakDetector,
      lastLeakDetectionDate,
      assemblyAt,
      disassemblyAt,
      isDeleted,
    );

    const installation = this.realm.create(Installation.schema.name, object, true);

    const circuits = [primaryCircuit, secondaryCircuit].filter(circuit => !!circuit);

    installation.circuits = circuits.map((circuit, index) => this.loadCircuit(installation, index, circuit));

    return installation;
  }

  loadCircuit(installation, index, data = null) {
    if (!data) {
      return null;
    }

    const {
      fluidUuid,
      currentLoad,
      nominalLoad,
      oilUuid,
      oilQuantity,
      coolantUuid,
      coolantQuantity,
      coolantLevelPercent,
      otherCoolantName,
      components,
      pressure,
      antacid,
      otherOilName,
    } = data;

    const object = Circuit.create(
      installation,
      index,
      this.fluidRepository.find(fluidUuid),
      this.oilRepository.find(oilUuid),
      this.coolantRepository.find(coolantUuid),
      currentLoad,
      nominalLoad,
      oilQuantity,
      coolantQuantity,
      coolantLevelPercent,
      otherCoolantName,
      [],
      pressure,
      antacid,
      otherOilName,
    );

    const circuit = this.realm.create(Circuit.schema.name, object, true);

    circuit.components = (components || []).map(component => this.loadComponent(circuit, component));

    return circuit;
  }

  loadComponent(circuit, data) {
    const {
      uuid,
      barcode,
      designation,
      natureUuid,
      natureClassificationUuid,
      natureTypeUuid,
      mark,
      model,
      brandUuid,
      serialNumber,
      usagePercent,
      commissioningDate,
    } = data;

    const object = Component.create(
      uuid,
      circuit,
      this.componentNatureRepository.find(natureUuid),
      designation,
      mark,
      barcode,
      this.componentNatureClassificationRepository.find(natureClassificationUuid),
      this.componentNatureTypeRepository.find(natureTypeUuid),
      new Date(commissioningDate),
      this.componentBrandRepository.find(brandUuid),
      null,
      model,
      serialNumber,
      usagePercent,
      true,
    );

    return this.realm.create(Component.schema.name, object, true);
  }

  loadLeak(data) {
    const { uuid, componentUuid, location, repaired } = data;

    return this.realm.create(Leak.schema.name, Leak.create(componentUuid, location, repaired, uuid), true);
  }
}

export default ClientTreeImporter;
