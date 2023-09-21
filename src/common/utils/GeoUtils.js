class GeoUtils {
  /**
   * Calculate distance in kilometers from 2 points designated by their latitude / longitude
   *
   * @param {float} lat1
   * @param {float} lon1
   * @param {float} lat2
   * @param {float} lon2
   *
   * @returns {number}
   */
  static getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = this.degreeToRadian(lat2 - lat1);
    const dLon = this.degreeToRadian(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreeToRadian(lat1)) *
        Math.cos(this.degreeToRadian(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  }

  /**
   * Transform geometrical angle expressed in degree to geometrical angle expressed in radians
   *
   * @param {float} degree
   *
   * @returns {number}
   */
  static degreeToRadian(degree) {
    return (degree * Math.PI) / 180;
  }
}

export default GeoUtils;
