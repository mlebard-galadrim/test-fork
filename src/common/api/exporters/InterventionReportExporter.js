import { get } from 'k2/app/container';

class InterventionReportExporter {
  constructor() {
    this.interventionReportRepository = get('intervention_report_repository');

    this.getRaw = this.getRaw.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.clearUnSafeData = this.clearUnSafeData.bind(this);
    this.transformToResource = this.transformToResource.bind(this);
    this.finishExport = this.finishExport.bind(this);
  }

  getRaw() {
    const unsynced = this.interventionReportRepository.findUnsynced();

    return { unsynced };
  }

  retrieve() {
    const { unsynced } = this.getRaw();

    return unsynced.map(this.transformToResource);
  }

  clearUnSafeData() {
    const { unsynced } = this.getRaw();

    this.interventionReportRepository.delete(unsynced);
  }

  /**
   * @param {InterventionReport} report
   *
   * @return {{type: String, data: Object}}
   */
  transformToResource(report) {
    const {
      uuid,
      reportNumber,
      interventions,
      roundTripGoStartDate,
      roundTripGoEndDate,
      roundTripGoDistance,
      roundTripReturnStartDate,
      roundTripReturnEndDate,
      roundTripReturnDistance,
      startDate,
      endDate,
      billingSite,
      comment,
      operatorSignature,
      clientSignature,
      createdAt,
    } = report;

    return {
      type: 'intervention_report',
      data: {
        uuid,
        reportNumber,
        interventions: interventions.map(intervention => intervention.id),
        roundTripGoStartDate: roundTripGoStartDate ? roundTripGoStartDate.toISOString() : null,
        roundTripGoEndDate: roundTripGoEndDate ? roundTripGoEndDate.toISOString() : null,
        roundTripGoDistance,
        roundTripReturnStartDate: roundTripReturnStartDate ? roundTripReturnStartDate.toISOString() : null,
        roundTripReturnEndDate: roundTripReturnEndDate ? roundTripReturnEndDate.toISOString() : null,
        roundTripReturnDistance,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        billingSite: billingSite ? billingSite.id : null,
        comment,
        operatorSignature,
        clientSignature,
        creation: createdAt.toISOString(),
      },
    };
  }

  finishExport() {
    // Clean closed reports once synced:
    const { unsynced } = this.getRaw();

    this.interventionReportRepository.delete(unsynced);
  }
}

export default InterventionReportExporter;
