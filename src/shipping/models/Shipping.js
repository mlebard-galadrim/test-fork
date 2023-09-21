import UUID from 'react-native-uuid';
import ShippingType from './ShippingType';

/**
 * Déplacements: Envoi/Réception
 */
class Shipping {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  /**
   * @param {String|ShippingType}  type
   * @param {String|null}          site             Nullable for shipping with an Ariane operation
   * @param {ShippedContainer[]}   containers       List of shipped containers
   * @param {String|null}          record
   * @param {String|null}          observations
   * @param {Carrier}              carrier          Optional. Only for ship out.
   * @param {String}               carrierSignature Mandatory if carrier is selected.
   * @param {Site|null}            treatmentSite
   * @param {ArianeOperation|null} arianeOperation  For shippings with documents
   * @param {ShippedBsff[]} bsffs Trackdechets BSFFs
   * @param {ShippedBsdd[]} bsdds Trackdéchets BSDDs
   * @param {string|null}   licensePlate The carrier's license plate
   *
   * @return {Shipping}
   */
  static create(
    type,
    site,
    containers = [],
    record = null,
    observations = null,
    carrier = null,
    carrierSignature = null,
    treatmentSite = null,
    arianeOperation = null,
    bsffs = [],
    bsdds = [],
    licensePlate = null,
  ) {
    const instance = new this();

    instance.id = UUID.v4();
    instance.type = type instanceof ShippingType ? type.value : new ShippingType(type).value;
    instance.site = site;
    instance.containers = containers;
    instance.record = record;
    instance.observations = observations;
    instance.arianeOperation = arianeOperation;
    instance.creation = new Date();
    if (carrier && instance.type !== ShippingType.OUT) {
      throw new Error('Can only set a carrier when shipping out.');
    }

    if (!site && !arianeOperation) {
      throw new Error('Can only create a shipping without site if an Ariane operation is set.');
    }

    instance.carrier = carrier;

    instance.carrierSignature = carrierSignature;
    instance.treatmentSite = treatmentSite;

    // Trackdéchets:
    instance.bsffs = bsffs;
    instance.bsdds = bsdds;

    instance.licensePlate = licensePlate;

    instance.synced = false;

    return instance;
  }
}

Shipping.schema = {
  name: 'Shipping',
  primaryKey: 'id',
  properties: {
    id: 'string',
    type: 'string',
    site: 'string?',
    carrier: { type: 'string', optional: true },
    containers: { type: 'list', objectType: 'ShippedContainer' },
    record: { type: 'string', optional: true },
    observations: { type: 'string', optional: true },
    carrierSignature: { type: 'string', optional: true },
    treatmentSite: { type: 'string', optional: true },
    arianeOperation: { type: 'ArianeOperation', optional: true },
    creation: 'date',
    synced: 'bool',
    // Trackdéchets only:
    bsffs: { type: 'list', objectType: 'ShippedBsff' },
    bsdds: { type: 'list', objectType: 'ShippedBsdd' },
    licensePlate: { type: 'string', optional: true },
  },
};

export default Shipping;
