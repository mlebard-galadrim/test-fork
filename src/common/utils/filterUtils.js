/**
 * Sort alphabetically
 *
 * @param {String} a
 * @param {String} b
 *
 * @return {Number}
 */
export function alphabetically(a, b) {
  return (a || '').localeCompare(b || '');
}

/**
 * Sort numerically
 *
 * @param {Number|null} a
 * @param {Number|null} b
 *
 * @return {Number}
 */
export function numerically(a, b) {
  return (a || 0) - (b || 0);
}

/**
 * Display a fixed
 *
 * @param {Number} value
 * @param {Number} precision
 *
 * @return {String}
 */
export function fixed(value, precision = 2) {
  if (!value) {
    return '0';
  }

  return value.toFixed(precision).replace(/\.?0*$/, '');
}
