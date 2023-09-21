/**
 * @property {String} uuid
 * @property {String} designation
 * @property {?FluidFamily} family
 * @property {Number} teqCo2Factor
 * @property {Boolean} usableInPrimaryCircuit
 * @property {Boolean} regenerated
 * @property {Number} wasteLoadPercent
 * @property {String} wasteUniqId
 * @property {String} wasteAdrDenomination
 */
class Fluid {
  constructor() {
    // noop for realm
  }

  static create(
    uuid,
    designation,
    family,
    teqCo2Factor,
    usableInPrimaryCircuit,
    regenerated,
    wasteLoadPercent,
    wasteUniqId,
    wasteAdrDenomination,
  ) {
    const instance = new this();

    instance.uuid = uuid;
    instance.designation = designation;
    instance.family = family;
    instance.teqCo2Factor = teqCo2Factor;
    instance.usableInPrimaryCircuit = usableInPrimaryCircuit;
    instance.regenerated = regenerated;
    instance.wasteLoadPercent = wasteLoadPercent;
    instance.wasteUniqId = wasteUniqId;
    instance.wasteAdrDenomination = wasteAdrDenomination;

    return instance;
  }
}

Fluid.schema = {
  name: 'Fluid',
  primaryKey: 'uuid',
  properties: {
    uuid: 'string',
    designation: 'string',
    family: { type: 'FluidFamily', optional: true },
    teqCo2Factor: 'double',
    usableInPrimaryCircuit: 'bool',
    regenerated: 'bool',
    wasteLoadPercent: 'int',
    wasteUniqId: 'string',
    wasteAdrDenomination: 'string',
  },
};

export default Fluid;
