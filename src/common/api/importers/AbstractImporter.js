export default class AbstractImporter {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    this.realm = realm;
  }

  load() {
    throw new Error('An importer must implement "load"');
  }

  /**
   * Removes only stale objects from db (objects for which identifier is not present in the resources list.
   *
   * @param {AbstractRepository} repository
   * @param {string}             resourceID Resource id field name
   * @param {Object[]}           resources The resources to conserve
   * @param {Function}           beforeRemove
   */
  removeStaleObjects(repository, resourceID, resources, beforeRemove = null) {
    __DEV__ && console.debug(`Computing list of ${repository.schema.name} to remove`);
    const toRemove = repository.findAllNotIn(resources.map(item => item[resourceID]));
    __DEV__ && console.debug(`${toRemove.length} ${repository.schema.name} to remove:`, toRemove);
    beforeRemove && beforeRemove(toRemove);
    this.realm.delete(toRemove);
  }
}
