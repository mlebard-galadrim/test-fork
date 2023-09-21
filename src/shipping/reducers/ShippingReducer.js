import {
  CREATE_SHIPPING,
  SELECT_CARRIER,
  CANCEL_CARRIER_SELECTION,
  SELECT_DESTINATION_TYPE,
  CANCEL_DESTINATION_TYPE_SELECTION,
  SELECT_SUPPLIER,
  CANCEL_SUPPLIER_SELECTION,
  SELECT_TREATMENT_SITE,
  CANCEL_TREATMENT_SITE_SELECTION,
  SHIPPING_CANCEL_CONTAINERS_SELECTION,
  SHIPPING_CONFIRM_SELECTED_CONTAINERS,
  SHIPPING_REMOVE_SELECTED_CONTAINER,
  SHIPPING_REPLACE_SELECTED_CONTAINER,
  SHIPPING_ADD_CONTAINER,
  SHIPPING_USE_DOCUMENT,
  SHIPPING_SET_ARIANE_OPERATION,
  SHIPPING_CANCEL_ARIANE_OPERATION,
  SHIPPING_BATCH_SCAN_TRACKDECHETS_BORDEREAUX_CONFIRM,
  SHIPPING_BATCH_SCAN_TRACKDECHETS_BORDEREAUX_CANCEL,
  SHIPPING_SET_CARRIER_LICENSE_PLATE,
} from '../constants';
import { SELECT_SITE } from '../../installation/constants';
import { SYNCHRONIZE_SUCCESS } from '../../authentication/constants';
import { INTERVENTION_CREATE } from '../../intervention/constants';

const arianeInitialState = Object.freeze({
  /**
   * @type {?Boolean} Is using document for an Ariane operation or not
   */
  isUsingDocument: null,
  /**
   * @type {Object.<String, Number>} Line number per container uuid
   */
  arianeOperationLineNumbers: Object.freeze({}),
  /**
   * @type {?{ type: String, companyNumber: Number, number: Number, lines: Object[] }}
   */
  arianeOperation: null,
  /**
   * @type {?Client} if the client is known by Clim'app
   */
  arianeOperationKnownClient: null,
});

const initialState = Object.freeze({
  type: null,
  site: null,
  carrier: null,
  carrierSelected: false,
  /**
   * undefined until selection is confirmed.
   * Can be empty for shipping without any container but with bsffs/bsdds (Trackdéchets).
   */
  containerIdentifiers: undefined,
  bsffs: undefined,
  bsdds: undefined,
  shippingContainers: [],
  destinationType: null,
  licensePlate: null,
  ...arianeInitialState,
});

export default function shippingReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case INTERVENTION_CREATE:
    case SYNCHRONIZE_SUCCESS:
      return initialState;

    case CREATE_SHIPPING:
      return {
        ...initialState,
        type: payload.type,
      };

    case SELECT_SITE:
      return {
        ...state,
        site: payload.site,
      };

    case SELECT_CARRIER:
      return {
        ...state,
        carrier: payload.carrier,
        carrierSelected: true,
      };

    case CANCEL_CARRIER_SELECTION:
      return {
        ...state,
        carrier: null,
        carrierSelected: false,
      };

    case SELECT_DESTINATION_TYPE:
      return {
        ...state,
        destinationType: payload.destinationType,
      };

    case SELECT_SUPPLIER:
      return {
        ...state,
        site: payload.supplier,
      };

    case CANCEL_SUPPLIER_SELECTION:
      return {
        ...state,
        site: null,
      };

    case SELECT_TREATMENT_SITE:
      return {
        ...state,
        site: payload.treatment,
      };

    case CANCEL_TREATMENT_SITE_SELECTION:
      return {
        ...state,
        site: null,
      };

    case CANCEL_DESTINATION_TYPE_SELECTION:
      return {
        ...state,
        destinationType: null,
      };

    case SHIPPING_USE_DOCUMENT:
      return {
        ...state,
        isUsingDocument: payload.isUsingDocument,
      };

    case SHIPPING_SET_ARIANE_OPERATION:
      return {
        ...state,
        arianeOperation: payload.arianeOperation,
        arianeOperationKnownClient: payload.knownClient,
      };

    case SHIPPING_CANCEL_ARIANE_OPERATION:
      return {
        ...state,
        arianeOperation: null,
        arianeOperationKnownClient: null,
      };

    case SHIPPING_CONFIRM_SELECTED_CONTAINERS:
      return {
        ...state,
        containerIdentifiers: payload.containers.map(container => container.id),
      };

    case SHIPPING_ADD_CONTAINER: {
      const containers = state.shippingContainers.slice(0);
      containers.unshift(payload.container);
      const arianeOperationLineNumbers = { ...state.arianeOperationLineNumbers };

      if (payload.arianeOperationLineNumber) {
        arianeOperationLineNumbers[payload.container.id] = payload.arianeOperationLineNumber;
      }

      return {
        ...state,
        shippingContainers: containers,
        containerIdentifiers: undefined,
        arianeOperationLineNumbers,
      };
    }

    case SHIPPING_REPLACE_SELECTED_CONTAINER: {
      const containers = state.shippingContainers.slice(0);
      const previousContainer = containers[payload.index];
      containers[payload.index] = payload.container;
      const arianeOperationLineNumbers = { ...state.arianeOperationLineNumbers };

      delete arianeOperationLineNumbers[previousContainer.id];
      if (payload.arianeOperationLineNumber) {
        arianeOperationLineNumbers[payload.container.id] = payload.arianeOperationLineNumber;
      }

      return {
        ...state,
        shippingContainers: containers,
        containerIdentifiers: undefined,
        arianeOperationLineNumbers,
      };
    }

    case SHIPPING_REMOVE_SELECTED_CONTAINER: {
      const containers = state.shippingContainers.slice(0);
      const [removedContainer] = containers.splice(payload.index, 1);
      const arianeOperationLineNumbers = { ...state.arianeOperationLineNumbers };

      delete arianeOperationLineNumbers[removedContainer];

      return {
        ...state,
        shippingContainers: containers,
        containerIdentifiers: undefined,
        arianeOperationLineNumbers,
      };
    }

    case SHIPPING_CANCEL_CONTAINERS_SELECTION:
      return {
        ...state,
        containerIdentifiers: undefined,
        shippingContainers: [],
        arianeOperationLineNumbers: {},
      };

    case SHIPPING_BATCH_SCAN_TRACKDECHETS_BORDEREAUX_CONFIRM: {
      const { bsffs, bsdds } = payload;

      return {
        ...state,
        bsdds,
        bsffs,
      };
    }

    case SHIPPING_BATCH_SCAN_TRACKDECHETS_BORDEREAUX_CANCEL: {
      return {
        ...state,
        bsdds: undefined,
        bsffs: undefined,
      };
    }

    case SHIPPING_SET_CARRIER_LICENSE_PLATE: {
      return {
        ...state,
        licensePlate: payload.licensePlate,
      };
    }

    default:
      return state;
  }
}
