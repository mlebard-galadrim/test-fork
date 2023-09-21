import { get } from 'k2/app/container';
import ArianeOperation from 'k2/app/modules/shipping/models/ArianeOperation';
import ShippedContainer from 'k2/app/modules/shipping/models/ShippedContainer';

class ShippingExporter {
  constructor() {
    this.shippingRepository = get('shipping_repository');
    this.realm = get('realm');

    this.getRaw = this.getRaw.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.clearUnSafeData = this.clearUnSafeData.bind(this);
    this.transformShippingToResource = this.transformShippingToResource.bind(this);
    this.finishExport = this.finishExport.bind(this);
  }

  getRaw() {
    const shippings = this.shippingRepository.findUnsynced();

    return { shippings };
  }

  retrieve() {
    const { shippings } = this.getRaw();

    return shippings.map(this.transformShippingToResource);
  }

  clearUnSafeData() {
    const { shippings } = this.getRaw();

    shippings.forEach(shipping => this.shippingRepository.delete(shipping));

    this.realm.write(() => {
      this.realm.delete(this.realm.objects(ShippedContainer.schema.name));
      this.realm.delete(this.realm.objects(ArianeOperation.schema.name));
    });
  }

  /**
   * @param {Shipping} shipping
   *
   * @return {{type: String, data: Object}}
   */
  transformShippingToResource(shipping) {
    const {
      id,
      type,
      site,
      containers,
      record,
      observations,
      carrier,
      carrierSignature,
      treatmentSite,
      creation,
      arianeOperation,
      bsffs,
      bsdds,
      licensePlate,
    } = shipping;

    const data = {
      uuid: id,
      type,
      record,
      shippedContainers: Array.from(containers).map(container => ({
        containerUuid: container.id,
        arianeOperationLineNumber: container.arianeOperationLineNumber,
      })),
      observations,
      siteUuid: site,
      treatmentSiteUuid: treatmentSite,
      carrierUuid: carrier,
      carrierSignature,
      creation: creation.toISOString(),
      arianeOperation: arianeOperation
        ? {
          type: arianeOperation.type,
          companyNumber: arianeOperation.companyNumber,
          number: arianeOperation.number,
        }
        : null,
      bsffs: Array.from(bsffs).map(({ number }) => ({ number })),
      bsdds: Array.from(bsdds).map(({ number }) => ({ number })),
      licensePlate,
    };

    return { type: 'shipping', data };
  }

  finishExport() {
    this.shippingRepository.markAllAsSynced();
  }
}

export default ShippingExporter;
