import UUID from 'react-native-uuid';
import Detector from '../models/Detector';
import AbstractRepository from '../../common/repositories/AbstractRepository';

class DetectorRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm, Detector.schema);
  }

  /**
   * @param {String} barcode
   *
   * @return {Detector|null}
   */
  findByBarcodeOrSerialNumber(barcode) {
    const barcodeResult = this.realm.objects(this.schema.name).filtered('barcode == $0', barcode);

    if (barcodeResult.length) {
      return barcodeResult[0];
    }

    const serialNumberResult = this.realm.objects(this.schema.name).filtered('serialNumber == $0', barcode);

    if (serialNumberResult.length) {
      return serialNumberResult[0];
    }

    return null;
  }

  /**
   * Find or create Detector
   *
   * @param  {Client} client
   * @param  {String} serialNumber
   * @param  {String} barcode
   * @param  {String} designation
   * @param  {Date} lastInspectionDate
   * @param  {String} mark
   *
   * @return {Detector}
   */
  findOrCreate(client, serialNumber, barcode, designation, lastInspectionDate, mark) {
    const detector = this.findAll().filtered(
      'client.id == $0 AND serialNumber == $1 AND barcode == $2',
      client.id,
      serialNumber,
      barcode,
    );

    if (detector.length) {
      return detector[0];
    }

    return this.save(Detector.create(UUID.v4(), client, designation, serialNumber, barcode, lastInspectionDate, mark));
  }
}

export default DetectorRepository;
