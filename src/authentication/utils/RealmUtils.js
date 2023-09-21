import Realm from 'realm';

/**
 * Get Realm schema version
 *
 * @return {Number}
 */
export function getVersion() {
  return Realm.schemaVersion(Realm.defaultPath);
}
