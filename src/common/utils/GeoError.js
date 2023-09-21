import Enum from '../models/Enum';

/**
 * List of Geolocalisation errors
 *
 * @see {https://developer.mozilla.org/en-US/docs/Web/API/PositionError}
 */
class GeoError extends Enum {
  static UNKNOWN = 'unknown';

  static PERMISSION_DENIED = 1;

  static POSITION_UNAVAILABLE = 2;

  static TIMEOUT = 3;

  static values = [GeoError.UNKNOWN, GeoError.PERMISSION_DENIED, GeoError.POSITION_UNAVAILABLE, GeoError.TIMEOUT];

  static readables = {
    [GeoError.UNKNOWN]: 'enum:geolocation:error:unknown',
    [GeoError.PERMISSION_DENIED]: 'enum:geolocation:error:permission_denied',
    [GeoError.POSITION_UNAVAILABLE]: 'enum:geolocation:error:position_unavailable',
    [GeoError.TIMEOUT]: 'enum:geolocation:error:timeout',
  };
}

export default GeoError;
