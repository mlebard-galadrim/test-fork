export function shallowCloneRealmObject(x) {
  const copy = {};
  for (const key in x) {
    copy[key] = x[key];
  }
  return copy;
}
