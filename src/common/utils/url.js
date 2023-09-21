export function buildURLQuery(queryParams) {
  return Object.entries(filterQueryParams(queryParams))
    .reduce((encodedParams, [key, value]) => {
      let queryKey = key;
      let toEncode = [value];

      // Handle collection query params (?foo[]=1&foo[]=3):
      if (Array.isArray(value)) {
        queryKey = key + '[]';
        toEncode = value;
      }

      toEncode.forEach(collectionItem => {
        encodedParams.push([queryKey, collectionItem].map(encodeURIComponent).join('='));
      });

      return encodedParams;
    }, [])
    .join('&');
}

/**
 * Removes undefined values from query params
 */
function filterQueryParams(queryParams) {
  return Object.entries(queryParams).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = value;
    }

    return acc;
  }, {});
}

export function buildURL(baseUrl, params = {}, queryParams = {}) {
  let url = baseUrl;

  Object.entries(params).forEach(([name, value]) => (url = url.replace(`{${name}}`, encodeURIComponent(value))));

  if (Object.keys(filterQueryParams(queryParams)).length === 0) {
    return url;
  }

  return `${url}?${buildURLQuery(queryParams)}`;
}

const UrlUtils = {
  buildURL,
  buildURLQuery,
};

export default UrlUtils;
