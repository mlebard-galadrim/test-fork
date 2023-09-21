import { get } from 'k2/app/container';

export default class TransferExporter {
  constructor() {
    this.transferRepository = get('transfer_repository');

    this.getRaw = this.getRaw.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.clearUnSafeData = this.clearUnSafeData.bind(this);
    this.transformToResource = this.transformToResource.bind(this);
    this.finishExport = this.finishExport.bind(this);
  }

  getRaw() {
    const transfers = this.transferRepository.findUnsynced();

    return { transfers };
  }

  retrieve() {
    const { transfers } = this.getRaw();

    return transfers.map(this.transformToResource);
  }

  clearUnSafeData() {
    const { transfers } = this.getRaw();

    transfers.forEach(shipping => this.transferRepository.delete(shipping));
  }

  /**
   * @param {Transfer} transfer
   *
   * @return {{type: String, data: Object}}
   */
  transformToResource(transfer) {
    const { uuid, source, target, transferredLoad, date } = transfer;

    return {
      type: 'transfer',
      data: {
        uuid,
        sourceUuid: source.id,
        targetUuid: target.id,
        transferredLoad,
        date: date.toISOString(),
      },
    };
  }

  finishExport() {
    // Clean transfers once synced:
    this.transferRepository.deleteAll();
  }
}
