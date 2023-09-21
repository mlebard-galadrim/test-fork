/**
 * Returns a copy of the array without given element.
 */
function removeElement(array, element) {
  const copy = [...array];
  const index = copy.indexOf(element);

  if (index !== -1) {
    copy.splice(index, 1);
  }

  return copy;
}

/**
 * Returns a copy of the array with the new given element (only once).
 */
function addUniqueElement(array, element) {
  const set = new Set(array);
  set.add(element);

  return Array.from(set);
}

const ArrayUtils = {
  removeElement,
  addUniqueElement,
};

export default ArrayUtils;
