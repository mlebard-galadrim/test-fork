function knownFirst(c1, c2) {
  return c1.unknown === c2.unknown ? 0 : c1.unknown ? 1 : -1;
}

function climalifeFirst(c1, c2) {
  if (c1.competitor === c2.competitor) {
    return 0;
  }

  if (c1.competitor === null) {
    return -1;
  }

  if (c2.competitor === null) {
    return 1;
  }

  return 0;
}

function byDesignation(c1, c2) {
  return c1.article.designation.localeCompare(c2.article.designation);
}

/**
 * Sort containers for a search by barcode.
 *
 * @param {Container[]} containers
 */
export function sortForSearch(containers) {
  return Array.from(containers).sort((a, b) => {
    let r;
    // Known containers first:
    if ((r = knownFirst(a, b)) !== 0) {
      return r;
    }
    // Then Climalife unknown ones:
    if ((r = climalifeFirst(a, b)) !== 0) {
      return r;
    }
    // Then sort be designation:
    return byDesignation(a, b);
  });
}
