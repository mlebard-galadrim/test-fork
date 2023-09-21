import { get } from 'k2/app/container';

/**
 * @returns {ApiClient}
 */
export default function useApi() {
  return get('api');
}
