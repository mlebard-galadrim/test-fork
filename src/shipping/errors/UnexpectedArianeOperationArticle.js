export default class UnexpectedArianeOperationArticle extends Error {
  constructor(
    articleExternalId,
    barcode,
    // eslint-disable-next-line max-len
    message = `Article with external id "${articleExternalId}" in Ariane operation ${barcode} is not known by Clim'app.`,
  ) {
    super(message);
    this.name = 'UnexpectedArianeOperationArticle';
    this.barcode = barcode;
    this.articleExternalId = articleExternalId;
  }
}
