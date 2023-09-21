import AbstractRepository from '../../common/repositories/AbstractRepository';
import Installation from '../models/Installation';
import Site from '../models/Site';
import InstallationFilter from '../filters/InstallationFilter';

class InstallationRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   * @param {InstallationApplicationRepository} installationApplicationRepository
   * @param {InstallationTechnologyRepository} installationTechnologyRepository
   * @param {InstallationTypeRepository} installationTypeRepository
   * */
  constructor(realm, installationApplicationRepository, installationTechnologyRepository, installationTypeRepository) {
    super(realm, Installation.schema);

    this.installationApplicationRepository = installationApplicationRepository;
    this.installationTechnologyRepository = installationTechnologyRepository;
    this.installationTypeRepository = installationTypeRepository;
  }

  /**
   * {@inheritDoc}
   */
  findAll() {
    return super.findAll().sorted('name');
  }

  /**
   * @param {Site} site
   *
   * @return {RealmResults}
   */
  findForSite(site) {
    return this.findAll().filtered('site.id == $0', site.id);
  }

  /**
   * @param {String}       reference
   * @param {RealmResults} super
   *
   * @return {RealmResults}
   */
  findByReference(reference, query = super.findAll()) {
    return query.filtered('reference == $0', reference);
  }

  findByBarcodeWithFilter(barcode, filter) {
    switch (filter) {
      case InstallationFilter.LEAKING:
        return this.findByBarcode(barcode, this.findWithLeaks());

      case null:
        return this.findByBarcode(barcode);

      default:
        throw new Error(`Unsupported filter ${filter}.`);
    }
  }

  findWithLeaks(leaking = true) {
    return this.findAll().filtered('leaks.repaired == $0', !leaking);
  }

  /**
   * @param {String}                      barcode
   * @param {Realm.Results<Intervention>} query
   *
   * @return {Realm.Results<Intervention>}
   */
  findByBarcode(barcode, query = super.findAll()) {
    return query.filtered('barcode == $0', barcode);
  }

  /**
   * @return {Installation[]}
   */
  findUnsynced() {
    return this.getTable().filtered('synced == $0 OR circuits.components.synced == $0', false);
  }

  /**
   * Mark all items as synced
   */
  markAllAsSynced() {
    const installations = Array.from(this.findUnsynced());

    this.realm.write(() => {
      installations.forEach(installation => {
        installation.synced = true;
        installation.circuits.forEach(circuit => {
          circuit.components.forEach(component => {
            component.synced = true;
          });
        });
      });
    });
  }

  /**
   * @param {Installation} installation
   */
  save(installation) {
    const { type, application, technology } = installation;
    // We don't mutate original installation given,
    // but create a copy to fix existing references
    const rawInstallation = Object.assign(new Installation(), installation);

    if (application) {
      rawInstallation.application = this.installationApplicationRepository.find(application.uuid);
    }

    if (technology) {
      rawInstallation.technology = this.installationTechnologyRepository.find(technology.uuid);
    }

    if (type) {
      rawInstallation.type = this.installationTypeRepository.find(type.uuid);
    }

    const instance = super.save(rawInstallation);
    const { name, primaryKey } = Site.schema;

    installation.site = this.realm.objects(name).filtered(`${primaryKey} == $0`, installation.site[primaryKey])[0];

    this.realm.write(() => installation.site.installations.push(instance));

    return instance;
  }
}

export default InstallationRepository;
