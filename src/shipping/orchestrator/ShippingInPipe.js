import AbstractPipe from '../../common/orchestrator/AbstractPipe';

import {
  PIPE_SHIPPING_AUTO_FETCH_TRACKDECHETS_BORDEREAUX,
  PIPE_SHIPPING_BATCH_SCAN_CONTAINERS,
  PIPE_SHIPPING_DOCUMENT_SHUNT,
  PIPE_SHIPPING_SCAN_ARIANE_OPERATION_CONTAINERS,
  PIPE_SHIPPING_SCAN_DOCUMENT,
  PIPE_SHIPPING_SUMUP,
  PIPE_SHIPPING_SUPPLIER_SELECTION,
} from '../constants';
import { selectClient } from 'k2/app/modules/installation/actions/installationPipe';
import ClientType from 'k2/app/modules/installation/models/ClientType';
import ClientFilter from 'k2/app/modules/installation/filters/ClientFilter';
import dump from 'k2/app/modules/common/utils/dump';

class ShippingInPipe extends AbstractPipe {
  /**
   * @param {ClientPipe} installationClientPipe
   * @param {Security} security
   */
  constructor(installationClientPipe, security) {
    super();

    this.installationClientPipe = installationClientPipe;
    this.security = security;

    this.onArianeOperationSet = this.onArianeOperationSet.bind(this);
  }

  /**
   * @inheritdoc
   */
  getStep(state, dispatch) {
    const { site, isUsingDocument, containerIdentifiers, arianeOperation, bsdds, bsffs } = state.shippingReducer;

    if (isUsingDocument === null) {
      return PIPE_SHIPPING_DOCUMENT_SHUNT;
    }

    if (isUsingDocument) {
      // When using a document, we expect to scan an ariane operation next:
      if (!arianeOperation) {
        return [
          PIPE_SHIPPING_SCAN_DOCUMENT,
          {
            onArianeOperationSet: args => this.onArianeOperationSet(dispatch, args),
          },
        ];
      }

      // Once a document was scanned and an operation found, we need a site:
      if (!site) {
        // If the current user is attached to a company directly:
        if (this.security.isCompanyUser()) {
          // we ask for a supplier:
          return PIPE_SHIPPING_SUPPLIER_SELECTION;
        }

        // Otherwise, let's ask the client (if not pre-selected) + site:
        return [
          this.installationClientPipe.getStep(state),
          {
            // Non-preselected cases are for a CF user not matching the operation CF client.
            // In such a case, we ask the user to select from their own CF or DOs sites.
            filter: ClientFilter.FOR_SHIPPING_IN_WITH_DOCUMENT,
          },
        ];
      }
    } else {
      // No document, we select client/site directly:
      if (!site) {
        return [
          this.installationClientPipe.getStep(state),
          {
            filter: ClientFilter.FOR_SHIPPING_IN,
          },
        ];
      }
    }

    if (containerIdentifiers === undefined) {
      return arianeOperation ? PIPE_SHIPPING_SCAN_ARIANE_OPERATION_CONTAINERS : PIPE_SHIPPING_BATCH_SCAN_CONTAINERS;
    }

    // For Trackdéchets hierarchies, ask for BSFFs/BSDDs numbers to scan:
    // TODO: add hierarchy check
    if (bsffs === undefined || bsdds === undefined) {
      return PIPE_SHIPPING_AUTO_FETCH_TRACKDECHETS_BORDEREAUX;
    }

    return PIPE_SHIPPING_SUMUP;
  }

  /**
   * Triggered after an ariane operation is successfully scanned.
   * We analyze the user context to determine whether or not a client should be pre-selected, and which one,
   * before passing to the next steps.
   *
   * @param {Client?} knownClient
   */
  onArianeOperationSet(dispatch, { knownClient }) {
    const currentUser = this.security.getUserProfile();
    const userClient = this.security.getUserClient();
    const { type, fullExternalId } = userClient;
    const threshold = 4;

    console.debug('Ariane document scanned, triggering automatic shunt for client and site selection...', {
      currentUser: dump(currentUser, threshold),
      userClient: dump(userClient, threshold),
      knownClient: dump(knownClient, threshold),
    });

    if (type === ClientType.COMPANY) {
      console.debug('no client pre-selection for a company user (we ask for a supplier site instead)');
      return;
    }

    if (type === ClientType.CF && knownClient && fullExternalId === knownClient.getFullExternalIdAtLvl(ClientType.CF)) {
      console.debug("pre-select known client if the current user's CF matches the operation", {
        knownClient: dump(knownClient, threshold),
      });
      dispatch(selectClient(knownClient));
      return;
    }

    if (type === ClientType.DO) {
      console.debug('if the user is attached to a DO client, pre-select the DO itself', {
        userClient: dump(userClient, threshold),
      });
      dispatch(selectClient(userClient));
      return;
    }

    console.debug(
      'Other cases (CF user != CF operation) will be asked for the client (DO only)+site steps (no-preselection)',
    );
  }
}

export default ShippingInPipe;
