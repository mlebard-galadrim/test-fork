import {
  INTERVENTION_ADD_CONTAINER,
  INTERVENTION_ADD_CONTAINER_LOAD,
  INTERVENTION_ADD_COOLANT_CONTAINER,
  INTERVENTION_ADD_LEAK,
  INTERVENTION_CANCEL_LEAK,
  INTERVENTION_CREATE,
  INTERVENTION_EDIT_COOLANT_CONTAINER,
  INTERVENTION_MARK_AS_EMPTY,
  INTERVENTION_MOVE_CONTAINERS,
  INTERVENTION_PURPOSE,
  INTERVENTION_REMOVE_CONTAINER,
  INTERVENTION_REMOVE_COOLANT_CONTAINER,
  INTERVENTION_REPAIRED_LEAKS,
  INTERVENTION_RESET,
  INTERVENTION_SAVED,
  INTERVENTION_SET_CONTAINER_LOAD,
  INTERVENTION_SHOULD_CREATE_BSFF,
  INTERVENTION_SIGNATURE,
  INTERVENTION_UPDATE_NOMINAL_LOAD,
  INTERVENTION_VALIDATED,
} from '../constants';
import { SELECT_INSTALLATION } from '../../installation/constants';
import { SYNCHRONIZE_SUCCESS } from '../../authentication/constants';
import {
  CANCEL_DETECTOR_SELECTION,
  CONFIRM_DETECTOR_SELECTION,
  SELECT_DETECTOR_SUCCESS,
  SELECT_DETECTOR_UNKNOWN,
} from '../../detector/constants';
import Intervention from '../models/Intervention';
import { CREATE_SHIPPING } from '../../shipping/constants';
import InterventionType from 'k2/app/modules/intervention/models/InterventionType';
import { get } from 'k2/app/container';

const initialState = {
  intervention: null,
};

/**
 * Create a new intervention
 *
 * @param {String} type
 * @param {String} installation uuid
 * @param {String|null} purpose
 * @param {Date|null} performedAt
 *
 * @return {Intervention}
 */
function handleCreate(type, installation = null, purpose = null, uuid = null, performedAt = null) {
  return Intervention.create(type, installation, purpose, uuid, performedAt);
}

/**
 * Set the purpose of the current intervention
 *
 * @param {Intervention} intervention The current intervention
 * @param {String}       purpose
 */
function handlePurpose(intervention, purpose) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  intervention.setPurpose(purpose);
}

/**
 * Set the installation of the current intervention
 *
 * @param {Intervention} intervention The current intervention
 * @param {Installation} installation The selected installation
 */
function handleInstallation(intervention, installation) {
  if (!intervention) {
    return;
  }

  intervention.setInstallation(installation.id);
}

/**
 * Set the installation of the current intervention to null
 *
 * @param {Intervention} intervention The current intervention
 * @param {Installation} installation The selected installation
 */
function handleCancelInstallation(intervention) {
  if (!intervention) {
    return;
  }

  intervention.setInstallation(null);
}
/**
 * Add new container load to current intervention
 *
 * @param {Intervention} intervention The current intervention
 */
function handleAddContainerLoad(intervention) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  const containerLoad = intervention.addContainerLoad();

  // For drainage, where we load the installation fluid into the container,
  // pre-fill the container load fluid with the installation fluid:
  if (intervention.type === InterventionType.DRAINAGE) {
    const installationRepository = get('installation_repository');
    /** @type {Installation} */
    const installation = installationRepository.find(intervention.installation);
    containerLoad.fluid = installation.primaryCircuit.fluid.uuid;
  }
}

/**
 * Add new container to current intervention
 *
 * @param {Intervention} intervention The current intervention
 * @param {Container}    container
 */
function handleSetContainer(intervention, container) {
  if (!intervention) {
    return;
  }

  const containerLoad = intervention.getLastContainerLoad();
  const { id, barcode, fluid } = container;

  containerLoad.barcode = barcode.trim();
  containerLoad.containerUuid = id;

  if (fluid) {
    containerLoad.fluid = fluid.uuid;
  }
}

function handleCancelContainer(intervention) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  intervention.removeContainerLoad();
}

/**
 * Set "moveContainers" option to the current intervention
 *
 * @param {Intervention}  intervention    The current intervention
 * @param {Boolean}       moveContainers
 */
function handleSetMoveContainers(intervention, moveContainers) {
  if (!intervention) {
    return;
  }

  intervention.setMoveContainers(moveContainers);
}

/**
 * Update container load values
 *
 * @param {Intervention} intervention The current state (already cloned)
 * @param {Number}       loadDiff
 * @param {Boolean}      isRecycled
 * @param {Boolean}      forElimination
 * @param {Boolean}      clientOwned
 */
function handleUpdateContainerLoad(intervention, loadDiff, isRecycled, forElimination, clientOwned) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  const containerLoad = intervention.getLastContainerLoad();

  containerLoad.load = loadDiff;
  containerLoad.recycled = isRecycled;
  containerLoad.forElimination = forElimination;
  containerLoad.clientOwned = clientOwned;
}

/**
 * Add a declared leak to the intervention
 *
 * @param {Intervention} intervention The current state (already cloned)
 * @param {String|null}  leakingComponentUuid The component identifier. Null if not a component leak.
 * @param {String}       location The description of the component location.
 * @param {Boolean}      repaired Whether the leak is repaired yet or not.
 * @param {Number}       index Index of the leak
 */
function handleAddLeak(intervention, leakingComponentUuid, location, repaired, index) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  intervention.addLeak(leakingComponentUuid, location, repaired, index);
}

/**
 * Remove the leak corresponding to the given index from the intervention
 *
 * @param {Intervention} intervention
 * @param {Number} index
 */
function handleCancelLeak(intervention, index) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  intervention.removeLeak(index);
}

/**
 * Add a repaired leak to the intervention
 *
 * @param {Intervention} intervention The current state (already cloned)
 * @param {String[]}     leakUuids    The leaks identifiers.
 */
function handleRepairedLeaks(intervention, leakUuids) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  intervention.setRepairedLeak(leakUuids);
}

/**
 * Set the detector of the intervention
 *
 * @param {Object}   intervention The current state (already cloned)
 * @param {Detector} detector
 */
function handleDetector(intervention, detector) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  intervention.setDetector(detector.id);
}

/**
 * Unset the detector of the intervention
 *
 * @param {Object}   intervention The current state (already cloned)
 */
function cancelDetector(intervention) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  intervention.setDetector(null);
}

/**
 * Set markAsEmpty tag on the intervention
 *
 * @param {Object}  intervention The current state (already cloned)
 * @param {Boolean} markAsEmpty
 */
function handleMarkAsEmpty(intervention, markAsEmpty) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  intervention.setMarkAsEmpty(markAsEmpty);
}

/**
 * Set updateNominalLoad tag on the intervention
 *
 * @param {Object}  intervention The current state (already cloned)
 * @param {Boolean} updateNominalLoad
 */
function handleUpdateNominalLoad(intervention, updateNominalLoad) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  intervention.setUpdateNominalLoad(updateNominalLoad);
}

function handleShouldCreateBsff(intervention, shouldCreateBsff) {
  intervention.setShouldCreateBsffFiche(shouldCreateBsff);
}

/**
 * Handle signature
 *
 * @param {Intervention} intervention Current intervention
 * @param {Image}        signature    Signature as image
 * @param {String}       target       Target:'operator' or 'client'
 */
function handleSignature(intervention, signature, target) {
  switch (target) {
    case 'operator':
      intervention.setOperatorSignature(signature);
      break;
    case 'client':
      intervention.setClientSignature(signature);
      break;
    default:
      throw new Error(`No signature for target "${target}".`);
  }
}

function handleAddCoolantContainer(intervention) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  intervention.addCoolantContainer();
}

function handleRemoveCoolantContainer(intervention, index) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  intervention.removeCoolantContainer(index);
}

function handleEditCoolantContainer(intervention, index, field, value) {
  if (!intervention) {
    throw new Error('No current intervention.');
  }

  intervention.updateCoolantContainer(index, field, value);
}

/**
 * Handle intervention validation on recap screen
 *
 * @param {Intervention} intervention
 * @param {String}       record
 * @param {String}       observations
 * @param {Date|null}    performedAt
 */
function handleValidatedIntervention(intervention, record, observations, performedAt) {
  intervention.setRecord(record);
  intervention.setObservations(observations);
  intervention.setPerformedAt(performedAt);
}

/**
 * Clones the root state object
 *
 * @param {Object} state
 *
 * @return {Object}
 */
function cloneState(state) {
  return {
    ...state,
    intervention: state.intervention ? state.intervention.clone() : null,
  };
}

/**
 * Intervention pipe reducer: store any information related to the intervention creation pipe
 *
 * @param {Object} previousState
 * @param {Object} action
 *
 * @return {Object}
 */
export default function interventionPipe(previousState = initialState, action) {
  const { type, payload } = action;
  const state = cloneState(previousState);

  switch (type) {
    case CREATE_SHIPPING:
    case SYNCHRONIZE_SUCCESS:
    case INTERVENTION_RESET:
      return initialState;

    case INTERVENTION_CREATE:
      state.intervention = handleCreate(
        payload.type,
        payload.installationUuid,
        payload.purpose,
        payload.uuid,
        payload.performedAt,
      );
      break;

    case INTERVENTION_PURPOSE:
      handlePurpose(state.intervention, payload.purpose);
      break;

    case SELECT_INSTALLATION:
      if (payload.installation !== null) {
        handleInstallation(state.intervention, payload.installation);
      } else {
        // TODO: get proper cancel action.
        handleCancelInstallation(state.intervention);
      }
      break;

    case INTERVENTION_ADD_CONTAINER_LOAD:
      handleAddContainerLoad(state.intervention);
      break;

    case INTERVENTION_ADD_CONTAINER:
      handleSetContainer(state.intervention, payload.container);
      break;

    case INTERVENTION_MOVE_CONTAINERS:
      handleSetMoveContainers(state.intervention, payload.move);
      break;

    case INTERVENTION_REMOVE_CONTAINER:
      handleCancelContainer(state.intervention);
      break;

    case INTERVENTION_SET_CONTAINER_LOAD:
      handleUpdateContainerLoad(
        state.intervention,
        payload.loadDiff,
        payload.isRecycled,
        payload.forElimination,
        payload.clientOwned,
      );
      break;

    case INTERVENTION_ADD_LEAK:
      handleAddLeak(
        state.intervention,
        payload.leakingComponentUuid,
        payload.location,
        payload.repaired,
        payload.index,
      );
      break;

    case INTERVENTION_CANCEL_LEAK:
      handleCancelLeak(state.intervention, payload.index);
      break;

    case INTERVENTION_REPAIRED_LEAKS:
      handleRepairedLeaks(state.intervention, payload.leakUuids);
      break;

    case CONFIRM_DETECTOR_SELECTION:
      handleDetector(state.intervention, payload.detector);
      break;

    case CANCEL_DETECTOR_SELECTION:
    case SELECT_DETECTOR_SUCCESS:
    case SELECT_DETECTOR_UNKNOWN:
      cancelDetector(state.intervention);
      break;

    case INTERVENTION_MARK_AS_EMPTY:
      handleMarkAsEmpty(state.intervention, payload.markAsEmpty);
      break;

    case INTERVENTION_UPDATE_NOMINAL_LOAD:
      handleUpdateNominalLoad(state.intervention, payload.updateNominalLoad);
      break;

    case INTERVENTION_SHOULD_CREATE_BSFF:
      handleShouldCreateBsff(state.intervention, payload.shouldCreateBsff);
      break;

    case INTERVENTION_SIGNATURE:
      handleSignature(state.intervention, payload.signature, payload.target);
      break;

    case INTERVENTION_VALIDATED:
      handleValidatedIntervention(state.intervention, payload.record, payload.observations, payload.performedAt);
      break;

    case INTERVENTION_SAVED:
      state.intervention.saved = true;
      break;

    case INTERVENTION_ADD_COOLANT_CONTAINER:
      handleAddCoolantContainer(state.intervention);
      break;

    case INTERVENTION_REMOVE_COOLANT_CONTAINER:
      handleRemoveCoolantContainer(state.intervention, payload.index);
      break;

    case INTERVENTION_EDIT_COOLANT_CONTAINER:
      handleEditCoolantContainer(state.intervention, payload.index, payload.field, payload.value);
      break;
  }

  return state;
}
