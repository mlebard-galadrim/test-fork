import Config from 'react-native-config';
import Queue from './Queue';
import ClientTreeImporter from './importers/ClientTreeImporter';
import ContainerImporter from './importers/ContainerImporter';
import InterventionImporter from './importers/InterventionImporter';
import NomenclatureImporter from './importers/NomenclatureImporter';
import InterventionExporter from './exporters/InterventionExporter';
import ClientExporter from './exporters/ClientExporter';
import SiteExporter from './exporters/SiteExporter';
import InstallationExporter from './exporters/InstallationExporter';
import ShippingExporter from './exporters/ShippingExporter';
import ContainerExporter from './exporters/ContainerExporter';
import LeakDetectorExporter from './exporters/LeakDetectorExporter';
import ExportErrorReporter from './exporters/ExportErrorReporter';
import InterventionReportExporter from 'k2/app/modules/common/api/exporters/InterventionReportExporter';
import sync from '../actions/syncActions';
import * as Sentry from '@sentry/react-native';
import { updateLocalModificationCount } from '../../authentication/actions/authenticationActions';
import { ApiError } from './ApiClient';
import TransferExporter from 'k2/app/modules/common/api/exporters/TransferExporter';
import InterventionPlannedImporter from './importers/InterventionPlannedImporter';
import KitsImporter from './importers/KitsImporter';
import AnalysisExporter from './exporters/AnalysisExporter';
import AnalysesImporter from './importers/AnalysesImporter';

class Synchronizer {
  /**
   * How long before a new synchronization is needed? (in ms)
   *
   * @type {Number}
   */
  static SYNC_EVERY = 1000 * 60 * 60 * 24; // 24h

  /**
   * @param {ApiClient} api
   * @param {Realm} realm
   * @param {Store} store  The redux store handling the application state.
   */
  constructor(api, realm, store) {
    this.api = api;
    this.realm = realm;
    this.store = store;
    this.queue = null;
    this.exportErrorReporter = new ExportErrorReporter();
    this.exporters = {
      intervention: new InterventionExporter(),
      shipping: new ShippingExporter(),
      client: new ClientExporter(),
      site: new SiteExporter(),
      installation: new InstallationExporter(),
      container: new ContainerExporter(),
      leakDetector: new LeakDetectorExporter(),
      transfer: new TransferExporter(),
      interventionReport: new InterventionReportExporter(),
      analysis: new AnalysisExporter(),
    };
    this.importers = {
      clients: new ClientTreeImporter(this.realm),
      containers: new ContainerImporter(this.realm),
      interventions: new InterventionImporter(this.realm),
      interventionsPlanned: new InterventionPlannedImporter(this.realm),
      nomenclature: new NomenclatureImporter(this.realm),
      kits: new KitsImporter(this.realm),
      analyses: new AnalysesImporter(this.realm),
    };

    this.synchronize = this.synchronize.bind(this);
    this.onError = this.onError.bind(this);
    this.checkSuccess = this.checkSuccess.bind(this);
    this.prepareData = this.prepareData.bind(this);
    this.downloadData = this.downloadData.bind(this);
    this.sendDataErrorReport = this.sendDataErrorReport.bind(this);
  }

  /**
   * Synchronize all database
   *
   * @param {Function} success
   * @param {Function} failure
   * @param {Date|null} lastSynchronizationDate
   */
  synchronize(success, failure, lastSynchronizationDate = null) {
    if (this.isBusy()) {
      return;
    }

    console.info(
      lastSynchronizationDate ? `Synchronizing (since ${lastSynchronizationDate})` : 'Synchronizing (full data)...',
    );

    this.queue = new Queue(this.onComplete, success);

    const containerExporterResolver = this.queue.getTask(this.exporters.container.finishExport);
    const interventionExporterResolver = this.queue.getTask(this.exporters.intervention.finishExport);
    const shippingExporterResolver = this.queue.getTask(this.exporters.shipping.finishExport);
    const clientExporterResolver = this.queue.getTask(this.exporters.client.finishExport);
    const siteExporterResolver = this.queue.getTask(this.exporters.site.finishExport);
    const installationExporterResolver = this.queue.getTask(this.exporters.installation.finishExport);
    const leakDetectorExporterResolver = this.queue.getTask(this.exporters.leakDetector.finishExport);
    const transferExporterResolver = this.queue.getTask(this.exporters.transfer.finishExport);
    const interventionReportExporterResolver = this.queue.getTask(this.exporters.interventionReport.finishExport);
    const analysisExporterResolver = this.queue.getTask(this.exporters.analysis.finishExport);

    const nomenclatureLoader = this.registerLoader(this.importers.nomenclature);
    const clientLoader = this.registerLoader(this.importers.clients);
    const containersLoader = this.registerLoader(this.importers.containers);
    const interventionsLoader = this.registerLoader(this.importers.interventions);
    const interventionsPlannedLoader = this.registerLoader(this.importers.interventionsPlanned);
    const kitsLoader = this.registerLoader(this.importers.kits);
    const analysesLoader = this.registerLoader(this.importers.analyses);
    const loaders = {
      nomenclatureLoader,
      clientLoader,
      containersLoader,
      interventionsLoader,
      interventionsPlannedLoader,
      kitsLoader,
      analysesLoader,
    };

    const errorHandler = error => this.onError(error, failure);

    const downloadData = () => this.downloadData(lastSynchronizationDate, errorHandler, loaders);

    /**
     * Once sending the report succeeded, clean & continue to download step,
     * so data are reset to previous state and user can still use the app.
     */
    const onSuccessErrorReport = () => {
      // Remove local data:
      console.info('Cleaning unsafe data');
      this.exporters.leakDetector.clearUnSafeData();
      this.exporters.container.clearUnSafeData();
      this.exporters.client.clearUnSafeData();
      this.exporters.site.clearUnSafeData();
      this.exporters.installation.clearUnSafeData();
      this.exporters.shipping.clearUnSafeData();
      this.exporters.interventionReport.clearUnSafeData();
      this.exporters.intervention.clearUnSafeData();
      this.exporters.transfer.clearUnSafeData();
      this.exporters.analysis.clearUnSafeData();
      // Download from API:
      downloadData();
      this.store.dispatch(updateLocalModificationCount());
    };

    /**
     * On prepare error, attempt to send data error report
     */
    const onPrepareError = prepareError => {
      this.store.dispatch(sync.prepareDataFailed());

      this.sendDataErrorReport(prepareError, onSuccessErrorReport);

      errorHandler(prepareError);
    };

    const doSync = () => {
      // Prepare data
      const syncData = this.prepareData(onPrepareError);
      if (syncData === false) {
        // Skip next step on prepare data issues
        return;
      }

      // Send prepared data (Sync up: App -> API)
      this.store.dispatch(sync.sendData());
      this.api.postSyncData(
        syncData,
        // On send success:
        sendResult => {
          // If the API returned some sync issues, notify it.
          // We'll continue the sync anyway but let the user know the sync was partially successful
          this.checkSuccess(sendResult);

          // Finish exports, marking synced data:
          clientExporterResolver();
          siteExporterResolver();
          installationExporterResolver();
          containerExporterResolver();
          interventionExporterResolver();
          shippingExporterResolver();
          leakDetectorExporterResolver();
          transferExporterResolver();
          interventionReportExporterResolver();
          analysisExporterResolver();

          // Download from API:
          downloadData();
        },
        // On send error:
        responseContent => {
          this.store.dispatch(sync.sendDataFailed());

          errorHandler(new ApiError('Failed to send data', responseContent));
        },
      );
    };

    try {
      doSync();
    } catch (error) {
      errorHandler(error);
    }
  }

  /**
   * Get loader callback
   *
   * @param {AbstractImporter} importer
   *
   * @return {Function}
   */
  registerLoader(importer) {
    return this.queue.getTask(importer.load);
  }

  /**
   * Is synchronizer busy?
   *
   * @return {Boolean}
   */
  isBusy() {
    if (!this.queue) {
      return false;
    }

    return this.queue.isBusy();
  }

  /**
   * Is synchronization considered fresh?
   *
   * @param {Number|null} date
   * @param {Number} now
   *
   * @return {Boolean}
   */
  isFresh(date, now = Date.now()) {
    if (!date) {
      return false;
    }

    return now - date < Synchronizer.SYNC_EVERY;
  }

  onComplete() {
    console.info('Done!');
    this.queue = null;
  }

  /**
   * @param {Error} error
   * @param {Function} callback
   * @param {Boolean} rethrow
   */
  onError(error, callback = null, rethrow = false) {
    this.queue = null;

    if (parseInt(Config.APP_DEBUG, 10) === 1) {
      // Still log error, but prevent React rendering it as a red screen
      console.reportErrorsAsExceptions = false;
      console.error(error);

      if (error instanceof ApiError) {
        console.error(error.content);
      }

      console.reportErrorsAsExceptions = true;
      console.debug('Logging error to Sentry');
    }

    Sentry.captureException(error);

    if (callback) {
      callback(error);
    }

    if (rethrow) {
      throw error;
    }
  }

  checkSuccess(result) {
    if (result.failures > 0) {
      this.store.dispatch(sync.sendDataFailed(true));
      //Alert.alert(I18n.t('sync.failure.title'), I18n.t('sync.failure.content'));

      return false;
    }

    this.store.dispatch(sync.sendDataSucceeded());

    return true;
  }

  sendDataErrorReport(error, onSuccessErrorReport) {
    this.store.dispatch(sync.sendDataErrorReport());

    let report;
    try {
      const data = {};
      Object.entries(this.exporters).forEach(([key, exporter]) => {
        data[key] = exporter.getRaw();
      });

      report = this.exportErrorReporter.createReport(error, data);
    } catch (prepareReportError) {
      this.onError(prepareReportError, () => {
        this.store.dispatch(sync.sendDataErrorReportFailed());
      });

      return;
    }

    this.api.postSyncDataErrorReport(
      report,
      // success:
      () => {
        this.store.dispatch(sync.sendDataErrorReportSucceeded());
        onSuccessErrorReport();
      },
      // failure:
      data => {
        const sendReportError = new Error('Failed to send data error report.');
        sendReportError.responseData = data;

        this.onError(sendReportError, () => {
          this.store.dispatch(sync.sendDataErrorReportFailed());
          console.warn(sendReportError.responseData);
        });
      },
    );
  }

  prepareData(onError) {
    let syncData = [];
    try {
      this.store.dispatch(sync.prepareData());

      Object.entries(this.exporters).forEach(([key, exporter]) => {
        this.store.dispatch(sync.prepareData(key));
        syncData = syncData.concat(exporter.retrieve());
      });
    } catch (prepareError) {
      onError(prepareError);

      return false;
    }

    this.store.dispatch(sync.prepareDataSucceeded());

    return syncData;
  }

  /**
   * @param {Date|null} lastSynchronizationDate
   * @param {Function} errorHandler
   * @param {Record<String,Function>} loaders
   */
  downloadData(lastSynchronizationDate, errorHandler, loaders) {
    const {
      nomenclatureLoader,
      clientLoader,
      containersLoader,
      interventionsLoader,
      interventionsPlannedLoader,
      kitsLoader,
      analysesLoader,
    } = loaders;

    const downloadErrorHandler = downloadResponseContent => {
      this.store.dispatch(sync.downloadDataFailed());
      errorHandler(new ApiError('Failed to download data', downloadResponseContent));
    };

    const loadDataHandler = (loader, step, data, ...extraArgs) => {
      this.store.dispatch(sync.processData(step));
      try {
        loader(data, ...extraArgs);
      } catch (loadError) {
        this.store.dispatch(sync.processDataFailed());
        errorHandler(loadError);

        throw loadError;
      }
    };

    const loadInterventions = () => {
      this.store.dispatch(sync.downloadData('interventions'));
      this.api.getInterventions(interventions => {
        // All data were downloaded with success:
        this.store.dispatch(sync.downloadDataSucceeded());
        loadDataHandler(interventionsLoader, 'interventions', interventions);
        // All data were processed with success:
        this.store.dispatch(sync.processDataSucceeded());
      }, downloadErrorHandler);
    };

    const loadInterventionsPlanned = async () => {
      this.store.dispatch(sync.downloadData('interventionsPlanned'));
      try {
        const interventionsPlanned = await this.api.getInterventionsPlanned();
        loadDataHandler(interventionsPlannedLoader, 'interventionsPlanned', interventionsPlanned);
      } catch (error) {
        downloadErrorHandler(error);
      }
    };

    // const loadAnalyses = () => {
    //   this.store.dispatch(sync.downloadData('analyses'));
    //   this.api.getAnalyses(analyses => {
    //     // All data were downloaded with success:
    //     // this.store.dispatch(sync.downloadDataSucceeded());
    //     loadDataHandler(analysesLoader, 'analyses', analyses);
    //     // All data were processed with success:
    //     // this.store.dispatch(sync.processDataSucceeded());
    //   }, downloadErrorHandler);
    // };

    /**
     * Fetches & load containers by slices.
     *
     * @return {Promise<boolean>}
     */
    const loadContainers = async () => {
      // Initial slice starting from first ID:
      let after = 0;
      let sliceNb = 1;
      let success;

      /**
       * We use the approximate total company count returned by the API on first slice,
       * to estimate the number of slices and have a safeguard limiting the nb of calls.
       * A default is provided in case the API doesn't return the count (allows BC breaks for this optional guard).
       */
      let maxSliceNb = 50;

      // Init data variables:
      let fullSync, containers, removedContainerUuids, cursor, count, limit;
      let totalCount = 0;

      do {
        /**
         * Repeat:
         * - fetches a slice of containers
         * - loads them into the database
         * until there are no more containers to fetch (or safeguard is reached).
         */
        try {
          this.store.dispatch(sync.downloadData('containers', sliceNb));

          const data = await this.api.getContainersSlice(lastSynchronizationDate, after);
          // populate the loop data vars with the response:
          ({ fullSync, containers, removed: removedContainerUuids, cursor, count, limit } = data);
          totalCount += count;

          // Compute the max number of slices on first call:
          if (sliceNb === 1 && data?.totalCompanyCount) {
            const totalCompanyCount = data.totalCompanyCount;
            maxSliceNb = Math.ceil(totalCompanyCount / limit) + 1; // with extra safe one
            console.debug(`Will attempt max ${maxSliceNb} slices`);
          }
        } catch (error) {
          // Catches errors from the API call:
          downloadErrorHandler(error);
          // Stop the sync process.
          success = false;
          break;
        }

        // load the fetched containers slice:
        loadDataHandler(
          containersLoader,
          'containers',
          containers,
          removedContainerUuids,
          // Full sync can be forced by the server,
          // or if there is no last sync date yet:
          fullSync,
          sliceNb,
        );

        // hard break with success on the API explicitly telling us there are no more containers to fetch:
        if (cursor.hasNextPage === false) {
          success = true;
          break;
        }
        // hard break with success if we don't have any container in the response
        // (not supposed to happen with previous check, but still):
        if (count === 0 || containers.length === 0) {
          success = true;
          break;
        }
        // Safeguard : hard break with error on improbable nb of loops:
        if (sliceNb >= maxSliceNb) {
          downloadErrorHandler(`Aborting containers sync after improbable ${maxSliceNb} slices reached.`);
          // Stop the sync process.
          success = false;
          break;
        }

        // Update the loop variables:
        after = cursor.endCursor; // next slice will start from this
        sliceNb++;
      } while (true);

      if (success) {
        console.info(`Every ${totalCount} containers loaded!`);
      }

      return success;
    };

    this.store.dispatch(sync.downloadData('nomenclatures'));

    // Sync down: API -> App
    this.api.getNomenclature(nomenclatures => {
      // First, fetch nomenclatures:
      loadDataHandler(nomenclatureLoader, 'nomenclatures', nomenclatures);

      // Then kits:
      this.store.dispatch(sync.downloadData('kits'));
      this.api.getKits(data => {
        loadDataHandler(kitsLoader, 'kits', data);

        // Then analyses because god hates async operations:
        this.store.dispatch(sync.downloadData('analyses'));
        this.api.getAnalyses(analyses => {
          loadDataHandler(analysesLoader, 'analyses', analyses);

          // Then clients.
          this.store.dispatch(sync.downloadData('clients'));
          this.api.getClients(async clients => {
            loadDataHandler(clientLoader, 'clients', clients);
            // Then containers (which requires the clients and the nomenclature).
            const loadedContainers = await loadContainers();

            // Then interventions planned
            await loadInterventionsPlanned();

            if (loadedContainers) {
              // On successfully loaded every container slices,
              // we can start loading interventions (which requires containers):
              loadInterventions();
            }
          }, downloadErrorHandler);
        }, downloadErrorHandler);
      }, downloadErrorHandler);
    }, downloadErrorHandler);
  }
}

export default Synchronizer;
