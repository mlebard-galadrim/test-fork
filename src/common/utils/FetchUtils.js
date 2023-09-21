/**
 * Does the response has a body?
 *
 * @return {Boolean}
 */
Response.prototype.hasBody = function () {
  if (typeof this._bodyText !== 'undefined') {
    return this._bodyText.length > 0;
  }

  if (typeof this._bodyBlob !== 'undefined') {
    return this._bodyBlob.size > 0;
  }

  return false;
};
