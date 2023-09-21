import AbstractPipe from '../../common/orchestrator/AbstractPipe';

import {
  PIPE_SHIPPING_AUTO_FETCH_TRACKDECHETS_BORDEREAUX,
  PIPE_SHIPPING_BATCH_SCAN_CONTAINERS,
  PIPE_SHIPPING_DOCUMENT_SHUNT,
  PIPE_SHIPPING_SCAN_ARIANE_OPERATION_CONTAINERS,
  PIPE_SHIPPING_SCAN_DOCUMENT,
  PIPE_SHIPPING_SELECT_CARRIER,
  PIPE_SHIPPING_SELECT_DESTINATION_TYPE,
  PIPE_SHIPPING_SELECT_LICENSE_PLATE,
  PIPE_SHIPPING_SUMUP,
} from '../constants';
import { selectClient } from 'k2/app/modules/installation/actions/installationPipe';

class ShippingOutPipe extends AbstractPipe {
  /**
   * @param {ClientPipe} installationClientPipe
   */
  constructor(installationClientPipe) {
    super();

    this.installationClientPipe = installationClientPipe;
  }

  /**
   * @inheritdoc
   */
  getStep(state, dispatch) {
    const { isUsingDocument } = state.shippingReducer;

    if (isUsingDocument === null) {
      return PIPE_SHIPPING_DOCUMENT_SHUNT;
    }

    return isUsingDocument ? this.getWithDocumentStep(state, dispatch) : this.getWithoutDocumentStep(state);
  }

  /**
   * @param {object} state
   * @param {function} dispatch
   *
   * @returns {string|array}
   */
  getWithDocumentStep(state, dispatch) {
    const { arianeOperation, containerIdentifiers, carrierSelected, arianeOperationKnownClient, bsffs, bsdds } =
      state.shippingReducer;

    // When using a document, we expect to scan an ariane operation next:
    if (!arianeOperation) {
      return [
        PIPE_SHIPPING_SCAN_DOCUMENT,
        {
          onArianeOperationSet: ({ knownClient }) => {
            // If it's a know client, pre-select it in the client pipe,
            // so it won't be asked in order to select the site:
            if (knownClient) {
              dispatch(selectClient(knownClient));
            }
          },
        },
      ];
    }

    // When a document was scanned and an operation found, it can either be about a known or unknown Clim'app client.
    // If unknown, continue to batch scan directly, otherwise, select site for this client:
    if (arianeOperationKnownClient) {
      const next = this.selectDestinationSite(state);
      if (next) {
        return next;
      }
    }

    // Ariane operation batch scan containers:
    if (containerIdentifiers === undefined) {
      return PIPE_SHIPPING_SCAN_ARIANE_OPERATION_CONTAINERS;
    }

    // For Trackdéchets hierarchies, ask for BSFFs/BSDDs numbers to scan:
    // TODO: add hierarchy check
    if (bsffs === undefined || bsdds === undefined) {
      return PIPE_SHIPPING_AUTO_FETCH_TRACKDECHETS_BORDEREAUX;
    }

    // Ask for carrier, if the client is known:
    if (!carrierSelected && arianeOperationKnownClient) {
      return PIPE_SHIPPING_SELECT_CARRIER;
    }

    return PIPE_SHIPPING_SUMUP;
  }

  /**
   * @param {object} state
   *
   * @returns {string}
   */
  getWithoutDocumentStep(state) {
    const { containerIdentifiers, carrierSelected, carrier, bsffs, bsdds, licensePlate } = state.shippingReducer;

    // // No document, we select destination type/client/site directly:
    const next = this.selectDestinationSite(state);
    if (next) {
      return next;
    }

    // Batch scan containers:
    if (containerIdentifiers === undefined) {
      return PIPE_SHIPPING_BATCH_SCAN_CONTAINERS;
    }

    // For Trackdéchets hierarchies, ask for BSFFs/BSDDs numbers to scan:
    // TODO: add hierarchy check
    if (bsffs === undefined || bsdds === undefined) {
      return PIPE_SHIPPING_AUTO_FETCH_TRACKDECHETS_BORDEREAUX;
    }

    // Ask for carrier, unless using a document for an Ariane operation and for an unknown client:
    if (!carrierSelected) {
      return PIPE_SHIPPING_SELECT_CARRIER;
    }
    if (carrier === null && licensePlate === null) {
      return PIPE_SHIPPING_SELECT_LICENSE_PLATE;
    }

    return PIPE_SHIPPING_SUMUP;
  }

  /**
   * @param {object} state
   *
   * @returns {string|null}
   */
  selectDestinationSite(state) {
    const { destinationType, site } = state.shippingReducer;

    if (!destinationType) {
      return PIPE_SHIPPING_SELECT_DESTINATION_TYPE;
    }

    if (!site) {
      return this.installationClientPipe.getStep(state);
    }

    return null;
  }
}

export default ShippingOutPipe;
