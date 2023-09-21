import AbstractRepository from '../../common/repositories/AbstractRepository';
import Intervention from '../models/Intervention';
import InterventionType from '../models/InterventionType';
// eslint-disable-next-line no-unused-vars
import InterventionPlannedRepository from './InterventionPlannedRepository';
import Purpose from '../models/Purpose';

class InterventionRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   * @param {DetectorRepository} detectorRepository
   * @param {InstallationRepository} installationRepository
   * @param {InterventionPlannedRepository} interventionPlannedRepository
   */
  constructor(realm, detectorRepository, installationRepository, interventionPlannedRepository) {
    super(realm, Intervention.schema);

    this.detectorRepository = detectorRepository;
    this.installationRepository = installationRepository;
    this.interventionPlannedRepository = interventionPlannedRepository;
  }

  /**
   *
   * {@inheritdoc}
   * @param {Intervention} object
   */
  save(object) {
    super.save(object);
    this.interventionPlannedRepository.deleteById(object.id);

    const installation = this.installationRepository.find(object.installationId);

    const { performedAt, creation } = object;
    const saveDate = performedAt ?? creation;

    if (object.type === InterventionType.ASSEMBLY && object.purpose === Purpose.ASSEMBLY) {
      this.realm.write(() => {
        installation.addAssemblyDate(saveDate);
      });
    }

    if (object.type === InterventionType.DISASSEMBLY && object.purpose === Purpose.DISASSEMBLY) {
      this.realm.write(() => {
        installation.addDisassemblyDate(saveDate);
      });
    }

    if (object.type === InterventionType.FILLING && object.purpose === Purpose.COMMISSIONING) {
      this.realm.write(() => {
        installation.addCommissioningDate(saveDate);
      });
    }
  }

  /**
   * @param {String} installationId
   *
   * @return {Intervention|null}
   */
  findLastInterventionForInstallation(installationId) {
    const result = super.findAll().filtered('installation == $0', installationId).sorted('creation', true);

    return result.length ? result[0] : null;
  }

  /**
   * @return {Intervention[]}
   */
  findUnsynced() {
    return super.findUnsynced().sorted('creation', false);
  }

  /**
   *
   * @param {string} installationId
   * @returns {Interventio[]}
   */
  findUnsyncedForInstallation(installationId) {
    return super.findUnsynced().filtered('installation == $0', installationId);
  }

  /**
   * @return {Detector|null}
   */
  getLastUsedDetector() {
    const result = super.findAll().filtered('type == $0', InterventionType.LEAK).sorted('creation', true);

    if (!result.length) {
      return null;
    }

    const intervention = result[0];

    return this.detectorRepository.find(intervention.detector);
  }

  /**
   * @param {Site} site
   * @param {Date} day
   * @param {InterventionReport} currentReport
   *
   * @return {Intervention[]}
   */
  findBySiteAndDay(site, day, currentReport) {
    const start = new Date(day.valueOf());
    start.setHours(0, 0, 0);
    const end = new Date(day.valueOf());
    end.setHours(23, 59, 59);

    /** @type {Intervention[]} */
    const results = this.getTable()
      .filtered('creation >= $0 && creation <= $1', start, end) // for the provided day
      .filtered('reportUrl == null') // No generated report
      .filtered(
        // No ongoing report:
        'onGoingReports.@count == 0' +
          // Unless it is the current one:
          (currentReport ? ' OR ANY onGoingReports.uuid == $0' : ''),
        currentReport && currentReport.uuid,
      )
      .sorted('creation', true)
      .slice();
    // Intervention -> Installation isn't a true relation ship, but only stores the UUID,
    // so we need to filter ourselves:
    return results.filter(
      // for site:
      intervention => site.id === this.installationRepository.find(intervention.installation).site.id,
    );
  }

  /**
   * @return {Object[]}
   */
  findUpdated() {
    return this.getTable().filtered('updated == $0', true);
  }

  /**
   * Mark all items as synced
   */
  markAllAsSynced() {
    this.realm.write(() => {
      Array.from(this.findUnsynced()).forEach(item => {
        item.synced = true;
      });
      Array.from(this.findUpdated()).forEach(item => {
        item.updated = false;
      });
    });
  }
}

export default InterventionRepository;
