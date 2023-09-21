import AbstractRepository from '../../common/repositories/AbstractRepository';
import InterventionReport from 'k2/app/modules/intervention_report/model/InterventionReport';

export default class InterventionReportRepository extends AbstractRepository {
  /**
   * @param {Realm}realm
   * @param {InterventionRepository} interventionRepository
   */
  constructor(realm, interventionRepository) {
    super(realm, InterventionReport.schema);

    this.interventionRepository = interventionRepository;
  }

  /**
   * @param {Intervention} intervention
   *
   * @returns {InterventionReport|null}
   */
  findLastByIntervention(intervention) {
    return this.getTable().filtered('ANY interventions.id = $0', intervention.id).sorted('createdAt', true)[0] || null;
  }

  /**
   * @param {Site} site
   * @param {Date} day
   *
   * @returns {InterventionReport}
   */
  findLastBySiteAndDay(site, day = new Date()) {
    const start = new Date(day.valueOf());
    start.setHours(0, 0, 0);
    const end = new Date(day.valueOf());
    end.setHours(23, 59, 59);

    return (
      this.getTable()
        .filtered('date >= $0 && date <= $1', start, end)
        .filtered('site.id == $0', site.id)
        .sorted('createdAt', true)[0] || null
    );
  }

  /**
   * Find closed & unsynced reports.
   *
   * @return {InterventionReport[]}
   */
  findUnsynced() {
    return super.findUnsynced().filtered('closed == $0', true).sorted('createdAt', false);
  }
}
