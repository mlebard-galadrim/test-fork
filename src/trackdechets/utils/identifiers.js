/**
 * Ex: FF-20210927-RK57KRE51
 */
const REGEX_BSFF = /^FF-\d{8}-[\w\d]{9}$/;
/**
 * Ex: BSD-20210927-RK57KRE51
 */
const REGEX_BSDD = /^BSD-\d{8}-[\w\d]{9}$/;

/**
 * @see https://developers.trackdechets.beta.gouv.fr/reference/identifiants
 */
const TrackDechetsIdentifiers = {
  isBsffNumber: number => REGEX_BSFF.test(number),
  isBsddNumber: number => REGEX_BSDD.test(number),
  isValid: number => TrackDechetsIdentifiers.isBsffNumber(number) || TrackDechetsIdentifiers.isBsddNumber(number),
};

export default TrackDechetsIdentifiers;
