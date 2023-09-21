/**
 * Safely dump objects and other types for logging & reports purposes.
 * Used by the sync error reporter, as well as for Sentry breadcrumbs.
 * Its especially useful for Android builds for which logging or adding Sentry breadcrumb
 * with more complex objects may lead to an app freeze.
 * It also converts Realm objects to raw JS objects and avoid unnecessary references to them.
 *
 * @param {Number} threshold Max depth for the generated object
 */
export default function dump(data, threshold) {
  if (threshold === 0) {
    return '[...truncated data]';
  }
  --threshold;

  if (data === null) {
    return data;
  }

  if (data instanceof Function) {
    return '[...Function]';
  }

  if (typeof data !== 'object') {
    return data;
  }

  if (data.constructor.name === 'Date') {
    return data.toString();
  }

  if (data.toString() === '[object RealmObject]') {
    // If map is available, it's a Realm Result:
    if (undefined !== data.map) {
      return data.map(value => dump(value, threshold));
    }
    // Else, it's likely an entity as a Realm Object.
    // We need to convert it to a raw JS Object:
    const castedEntity = {};
    // This will not work anymore as of Realm 5.0.0 (same as 3.7.0-alpha but with removed functionalities)
    // https://github.com/realm/realm-js/releases/tag/v5.0.0
    // use obj.entries() directly?
    Object.entries(Object.getOwnPropertyDescriptors(data)).forEach(([propertyName, propertyDescriptor]) => {
      if (propertyName === '_realm') {
        return;
      }
      castedEntity[propertyName] = propertyDescriptor.value;
    });
    // Then, just dump as a regular object:
    return dump(castedEntity, threshold + 1);
  }

  const dumped = {};

  Object.entries(data).forEach(([key, value]) => {
    dumped[key] = dump(value, threshold);
  });

  return dumped;
}

/**
 * Safely dump objects for non dev environments.
 * Keeps the original data intact in __DEV__ envs.
 */
export function safeDump(data, threshold) {
  if (__DEV__) {
    return data;
  }

  return dump(data, threshold);
}
