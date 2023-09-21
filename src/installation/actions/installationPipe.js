import { SELECT_CLIENT, SELECT_SITE, SELECT_INSTALLATION, SELECT_CIRCUIT } from '../constants';

/**
 * Set selected client
 *
 * @param {?Client} client
 */
export function selectClient(client = null) {
  return { type: SELECT_CLIENT, payload: { client } };
}

/**
 * Set selected site
 *
 * @param {?Site} site
 */
export function selectSite(site = null) {
  return { type: SELECT_SITE, payload: { site } };
}

/**
 * Dispatch the fact an installation was selected
 *
 * @param {Installation} installation
 */
export function selectInstallation(installation) {
  return { type: SELECT_INSTALLATION, payload: { installation } };
}

/**
 * Set selected circuit
 *
 * @param {?Circuit} circuit
 */
export function selectCircuit(circuit = null) {
  return { type: SELECT_CIRCUIT, payload: { circuit } };
}
