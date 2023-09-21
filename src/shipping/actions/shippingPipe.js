import { get } from 'k2/app/container';
import {
  CANCEL_CARRIER_SELECTION,
  CANCEL_DESTINATION_TYPE_SELECTION,
  CANCEL_SUPPLIER_SELECTION,
  CANCEL_TREATMENT_SITE_SELECTION,
  CREATE_SHIPPING,
  SELECT_CARRIER,
  SELECT_DESTINATION_TYPE,
  SELECT_SUPPLIER,
  SELECT_TREATMENT_SITE,
  SHIPPING_ADD_CONTAINER,
  SHIPPING_BATCH_SCAN_TRACKDECHETS_BORDEREAUX_CANCEL,
  SHIPPING_BATCH_SCAN_TRACKDECHETS_BORDEREAUX_CONFIRM,
  SHIPPING_CANCEL_ARIANE_OPERATION,
  SHIPPING_CANCEL_CONTAINERS_SELECTION,
  SHIPPING_CONFIRM_SELECTED_CONTAINERS,
  SHIPPING_REMOVE_SELECTED_CONTAINER,
  SHIPPING_REPLACE_SELECTED_CONTAINER,
  SHIPPING_SAVED,
  SHIPPING_SET_ARIANE_OPERATION,
  SHIPPING_SET_CARRIER_LICENSE_PLATE,
  SHIPPING_USE_DOCUMENT,
} from '../constants';
import { updateLocalModificationCount } from '../../authentication/actions/authenticationActions';
import Shipping from '../models/Shipping';
import ShippingType from '../models/ShippingType';
import ShippedContainer from '../models/ShippedContainer';
import ClientType from '../../installation/models/ClientType';
import ArianeOperation from 'k2/app/modules/shipping/models/ArianeOperation';
import { selectClient } from 'k2/app/modules/installation/actions/installationPipe';
import UnexpectedArianeOperationArticle from 'k2/app/modules/shipping/errors/UnexpectedArianeOperationArticle';
import ShippedBsff from 'k2/app/modules/trackdechets/models/ShippedBsff';
import ShippedBsdd from 'k2/app/modules/trackdechets/models/ShippedBsdd';

/**
 * Create a new shipping of the given type
 *
 * @param {ShippingType} type
 */
export function createShipping(type) {
  return dispatch => {
    dispatch({ type: CREATE_SHIPPING, payload: { type } });
  };
}

/**
 * Set if we're using or not a document for an Ariane operation for this shipping
 *
 * @param {?Boolean} isUsingDocument
 */
export function setIsUsingDocument(isUsingDocument) {
  return dispatch => {
    dispatch({ type: SHIPPING_USE_DOCUMENT, payload: { isUsingDocument } });
  };
}

/**
 * @param {Object} rawOperation
 * @param {String} barcode used to get the operation
 */
export function setArianeOperation(rawOperation, barcode) {
  /** @var {ClientRepository} */
  const clientRepository = get('client_repository');
  /** @var {ArticleRepository} */
  const articleRepository = get('article_repository');

  return dispatch => {
    return new Promise((resolve, reject) => {
      const arianeOperation = {
        barcode,
        type: rawOperation.operationType,
        companyNumber: rawOperation.companyNumber,
        number: rawOperation.operationNumber,
        lines: rawOperation.lines.map(line => ({
          lineNumber: line.operationLineNumber,
          articleExternalId: `${line.articleNumberLine}`,
          quantity: line.quantity,
        })),
      };

      arianeOperation.lines.forEach(({ articleExternalId }) => {
        if (!articleRepository.findInMyHierarchyByExternalId(articleExternalId)) {
          throw new UnexpectedArianeOperationArticle(articleExternalId, barcode);
        }
      });

      const clientExternalId = [
        rawOperation.companyNumber, //Company
        rawOperation.billedCustomer, // CF
        rawOperation.primeContractor, // DO
      ]
        .filter(v => !!v)
        .join('-');

      // Search for an existing client:
      const knownClient = clientRepository.findWithFullExternalId(clientExternalId);

      dispatch({
        type: SHIPPING_SET_ARIANE_OPERATION,
        payload: {
          arianeOperation,
          knownClient,
        },
      });

      resolve({ arianeOperation, knownClient });
    });
  };
}

export function cancelArianeOperation() {
  return dispatch => {
    dispatch(selectClient(null)); // reset the pre-selected client in client/site/installation pipe as well
    dispatch({ type: SHIPPING_CANCEL_ARIANE_OPERATION });
  };
}

/**
 * Select a carrier (or null)
 *
 * @param {Carrier|null} carrier
 */
export function selectCarrier(carrier) {
  return dispatch => {
    dispatch({ type: SELECT_CARRIER, payload: { carrier } });
  };
}

/**
 * Cancel carrier selection
 */
export function cancelCarrierSelection() {
  return dispatch => {
    dispatch({ type: CANCEL_CARRIER_SELECTION });
  };
}

/**
 * Select a destination type or a shipping out
 *
 * @param {DestinationType} destinationType
 */
export function selectDestinationType(destinationType) {
  return dispatch => {
    dispatch({ type: SELECT_DESTINATION_TYPE, payload: { destinationType } });
  };
}

/**
 * Cancel a destination type selection
 */
export function cancelDestinationTypeSelection() {
  return dispatch => {
    dispatch({ type: CANCEL_DESTINATION_TYPE_SELECTION });
  };
}

/**
 * Select a supplier
 *
 * @param {Site} supplier
 */
export function selectSupplier(supplier) {
  return dispatch => {
    dispatch({ type: SELECT_SUPPLIER, payload: { supplier } });
  };
}

/**
 * Cancel supplier selection
 */
export function cancelSupplierSelection() {
  return dispatch => {
    dispatch({ type: CANCEL_SUPPLIER_SELECTION });
  };
}

/**
 * Select a treatment site
 *
 * @param {Site} treatment
 */
export function selectTreatmentSite(treatment) {
  return dispatch => {
    dispatch({ type: SELECT_TREATMENT_SITE, payload: { treatment } });
  };
}

/**
 * Cancel treatment selection
 */
export function cancelTreatmentSiteSelection() {
  return dispatch => {
    dispatch({ type: CANCEL_TREATMENT_SITE_SELECTION });
  };
}

/**
 * Get unique key for the given container (used for comparison)
 *
 * @param {Container} container
 *
 * @return {String}
 */
function getContainerKey(container) {
  return container.id.toString();
}

/**
 * Add container to list of containers (batch scan)
 *
 * @param {Container} container
 * @param {?Number}   arianeOperationLineNumber
 */
export function addShippingContainer(container, arianeOperationLineNumber) {
  return (dispatch, getState) => {
    const containers = getState().shippingReducer.shippingContainers;

    if (containers.find(item => getContainerKey(item) === getContainerKey(container))) {
      return; // Container already exists!
    }

    if (containers.find(item => item.barcode === container.barcode)) {
      // Replace container by new reference
      const index = containers.findIndex(item => item.barcode === container.barcode);

      dispatch({
        type: SHIPPING_REPLACE_SELECTED_CONTAINER,
        payload: { container, index, arianeOperationLineNumber },
      });

      return;
    }

    dispatch({
      type: SHIPPING_ADD_CONTAINER,
      payload: { container, arianeOperationLineNumber },
    });
  };
}

/**
 * Remove container to list of containers (batch scan)
 *
 * @param {Container} container
 */
export function removeShippingContainer(container) {
  return (dispatch, getState) => {
    const index = getState().shippingReducer.shippingContainers.findIndex(
      item => getContainerKey(item) === getContainerKey(container),
    );

    if (index === -1) {
      return; // Container does not exist!
    }

    dispatch({ type: SHIPPING_REMOVE_SELECTED_CONTAINER, payload: { index } });
  };
}

/**
 * Confirm the selected list of containers to ship
 *
 * @param {Array} containers An array of Container
 */
export function confirmContainersToShip(containers) {
  return {
    type: SHIPPING_CONFIRM_SELECTED_CONTAINERS,
    payload: { containers },
  };
}

/**
 * Cancel the selected list of containers to ship
 */
export function cancelContainersToShip() {
  return { type: SHIPPING_CANCEL_CONTAINERS_SELECTION };
}

/**
 * A container should be marked as to be reset as soon as it's sent out of the user hierarchy.
 *
 * To be kept in sync with PHP
 * @see \App\Application\Shipping\V1\Handler\CreateShippingCommandHandler::shouldResetContainers
 *
 * @param {String} type ShippingType value
 * @param {Site|null}   site
 */
function shouldResetContainer(type, site) {
  // Only shipping out:
  if (type !== ShippingType.OUT) {
    return false;
  }

  if (!site) {
    // If it is sent to an unknown site (out of Clim'app, with an Ariane operation), consider it to reset:
    return true;
  }

  // If it's a treatment site, distributor or a supplier, the container should be reset on next use:
  if (site.treatmentSite || site.client.type === ClientType.COMPANY || site.client.distributor) {
    return true;
  }

  // Otherwise, it's a intervention/mobile/warehouse site belonging to the user. So no reset:
  return false;
}

export function setCarrierLicensePlate(licensePlate) {
  return { type: SHIPPING_SET_CARRIER_LICENSE_PLATE, payload: { licensePlate } };
}

/**
 * Save a shipping.
 *
 * @param {String|null} record
 * @param {String|null} observations
 * @param {String|null} carrierSignature
 * @param {Site|null}   treatmentSite
 */
export function saveShipping(record, observations, carrierSignature, treatmentSite) {
  return (dispatch, getState) => {
    const state = getState().shippingReducer;
    const realm = get('realm');
    const shippingRepository = get('shipping_repository');
    const containerRepository = get('container_repository');

    const containers = state.containerIdentifiers.map(containerRepository.find);
    const shippedContainers = containers.map(container =>
      ShippedContainer.create(container.id, state.arianeOperationLineNumbers[container.id]),
    );

    const arianeOperation = state.arianeOperation
      ? ArianeOperation.create(
        state.arianeOperation.type,
        state.arianeOperation.companyNumber,
        state.arianeOperation.number,
      )
      : null;

    const { site, carrier, type, bsffs, bsdds, licensePlate } = state;

    const shipping = Shipping.create(
      type,
      site ? site.id : null,
      shippedContainers,
      record,
      observations,
      carrier ? carrier.id : null,
      carrierSignature,
      treatmentSite ? treatmentSite.id : null,
      arianeOperation,
      bsffs.map(number => ShippedBsff.create(number)),
      bsdds.map(number => ShippedBsdd.create(number)),
      licensePlate,
    );

    shippingRepository.save(shipping);

    if (site && (type === ShippingType.IN || (shipping.type === ShippingType.OUT && site.mobile))) {
      realm.write(() => containers.forEach(container => container.moveTo(site)));
    }

    // Check if containers should be reset on next usage:
    if (shouldResetContainer(type, site)) {
      realm.write(() =>
        containers.forEach(container => {
          container.toReset = true;
        }),
      );
    }

    realm.write(() => containers.forEach(container => container.setLastShippingType(shipping.type)));

    dispatch({ type: SHIPPING_SAVED, payload: shipping });
    dispatch(updateLocalModificationCount());
  };
}

export function confirmTrackdechetsBordereaux(bsffs, bsdds) {
  return { type: SHIPPING_BATCH_SCAN_TRACKDECHETS_BORDEREAUX_CONFIRM, payload: { bsffs, bsdds } };
}

export function cancelTrackdechetsBordereaux() {
  return { type: SHIPPING_BATCH_SCAN_TRACKDECHETS_BORDEREAUX_CANCEL };
}
