import dump from 'k2/app/modules/common/utils/dump';

export default class ExportErrorReporter {
  createReport(error, data) {
    return {
      error: error.message,
      data: dump(data, 7),
    };
  }
}
