import { get } from 'k2/app/container';
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
  INTERVENTION_SIGNED,
  INTERVENTION_UPDATE_NOMINAL_LOAD,
  INTERVENTION_VALIDATED,
} from '../constants';
import { updateLocalModificationCount } from '../../authentication/actions/authenticationActions';
import Purpose from '../models/Purpose';
import InterventionType from '../models/InterventionType';

/**
 * Create a new intervention of the given type
 *
 * @param {String} type
 * @param {String|null} installationUuid
 * @param {String|null} purpose
 * @param {String|null} uuid
 * @param {Date|null} performedAt
 */
export function createIntervention(type, installationUuid = null, purpose = null, uuid = null, performedAt = null) {
  return dispatch => {
    dispatch({
      type: INTERVENTION_CREATE,
      payload: { type, installationUuid, purpose, uuid, performedAt },
    });
  };
}

/**
 * Set purpose on the current intervention
 *
 * @param {String} purpose
 */
export function setPurpose(purpose) {
  return dispatch => dispatch({ type: INTERVENTION_PURPOSE, payload: { purpose } });
}

/**
 * Set the load for a specific container used during an intervention
 *
 * @param {Number}       loadDiff
 * @param {Boolean|null} isRecycled
 * @param {Boolean|null} forElimination
 * @param {Boolean|null} clientOwned
 */
export function setContainerLoad(loadDiff, isRecycled, forElimination, clientOwned) {
  return (dispatch, getState) => {
    const { intervention } = getState().interventionPipe;

    if (!intervention.containerLoads.length) {
      return;
    }

    dispatch({
      type: INTERVENTION_SET_CONTAINER_LOAD,
      payload: {
        loadDiff,
        isRecycled,
        forElimination,
        clientOwned,
      },
    });
  };
}

/**
 * Add a declared leak to the intervention
 *
 * @param {String|null} leakingComponentUuid The component identifier. Null if not a component leak.
 * @param {String} location The description of the component location.
 * @param {Boolean} repaired Whether the leak is repaired yet or not.
 * @param {Number} index Index of the leak in the list
 */
export function addLeak(leakingComponentUuid, location, repaired, index) {
  return {
    type: INTERVENTION_ADD_LEAK,
    payload: { index, leakingComponentUuid, location, repaired },
  };
}

/**
 * Remove the last declared leak from the intervention
 *
 * @param {Number} index Index of the leak in the list
 */
export function cancelLeak(index) {
  return (dispatch, getState) => {
    if (index >= getState().interventionPipe.intervention.leaks.length) {
      return;
    }

    dispatch({
      type: INTERVENTION_CANCEL_LEAK,
      payload: { index },
    });
  };
}

/**
 * Set the repaired leaks for the intervention
 *
 * @param {String[]} leakUuids The leaks identifiers.
 */
export function setRepairedLeaks(leakUuids) {
  return dispatch =>
    dispatch({
      type: INTERVENTION_REPAIRED_LEAKS,
      payload: { leakUuids },
    });
}

/**
 * Set markAsEmpty tag on the current intervention
 *
 * @param {Boolean} markAsEmpty
 */
export function setMarkAsEmpty(markAsEmpty) {
  return dispatch => dispatch({ type: INTERVENTION_MARK_AS_EMPTY, payload: { markAsEmpty } });
}

/**
 * Set updateNominalLoad tag on the current intervention
 *
 * @param {Boolean} updateNominalLoad
 */
export function setUpdateNominalLoad(updateNominalLoad) {
  return dispatch =>
    dispatch({
      type: INTERVENTION_UPDATE_NOMINAL_LOAD,
      payload: { updateNominalLoad },
    });
}

/**
 * Set client/operator signature on the current intervention
 *
 * @param {Image} signature
 */
export function setSignature(signature, target) {
  return dispatch => dispatch({ type: INTERVENTION_SIGNATURE, payload: { signature, target } });
}

export function addInterventionContainerLoad() {
  return { type: INTERVENTION_ADD_CONTAINER_LOAD };
}

export function addInterventionContainer(container) {
  return dispatch =>
    dispatch({
      type: INTERVENTION_ADD_CONTAINER,
      payload: { container },
    });
}

export function moveInterventionContainers() {
  return dispatch =>
    dispatch({
      type: INTERVENTION_MOVE_CONTAINERS,
      payload: { move: true },
    });
}

/**
 * Remove the last container from containerLoads list in interventions
 */
export function removeInterventionContainer() {
  return (dispatch, getState) => {
    if (!getState().interventionPipe.intervention.hasContainerLoads()) {
      return;
    }

    dispatch({ type: INTERVENTION_REMOVE_CONTAINER });
  };
}

export function saveShouldCreateBsff(shouldCreateBsff) {
  return dispatch => {
    return dispatch({
      type: INTERVENTION_SHOULD_CREATE_BSFF,
      payload: {
        shouldCreateBsff,
      },
    });
  };
}

/**
 * Validate the current intervention
 *
 * @param {String} record
 * @param {String} observations
 * @param {Date|null} performedAt
 */
export function validateIntervention(record, observations, performedAt) {
  return dispatch =>
    dispatch({
      type: INTERVENTION_VALIDATED,
      payload: { record, observations, performedAt },
    });
}

export function addSignature(id, type, signature) {
  return dispatch => {
    const interventionRepository = get('intervention_repository');
    const intervention = interventionRepository.find(id);
    const realm = get('realm');

    if (intervention) {
      switch (type) {
        case 'operator':
          realm.write(() => {
            intervention.setOperatorSignature(signature);
            intervention.update();
          });
          break;

        case 'client':
          realm.write(() => {
            intervention.setClientSignature(signature);
            intervention.update();
          });
          break;

        default:
          throw new Error(`No signature for target "${type}".`);
      }

      dispatch({ type: INTERVENTION_SIGNED, payload: { intervention } });
      dispatch(updateLocalModificationCount());
    }
  };
}

export function addCoolantContainer() {
  return dispatch => dispatch({ type: INTERVENTION_ADD_COOLANT_CONTAINER });
}

export function removeCoolantContainer(index) {
  return dispatch => dispatch({ type: INTERVENTION_REMOVE_COOLANT_CONTAINER, payload: { index } });
}

export function editCoolantContainer(index, field, value) {
  return dispatch => dispatch({ type: INTERVENTION_EDIT_COOLANT_CONTAINER, payload: { index, field, value } });
}

/**
 * Save intervention
 */
export function saveIntervention() {
  return (dispatch, getState) => {
    if (!get('validator').isInterventionComplete()) {
      return;
    }

    const { intervention } = getState().interventionPipe;
    const interventionRepository = get('intervention_repository');
    const installationRepository = get('installation_repository');
    const containerRepository = get('container_repository');
    const fluidRepository = get('fluid_repository');
    const realm = get('realm');
    const installation = installationRepository.find(intervention.installation);
    const { type, purpose } = intervention;
    const { primaryCircuit: circuit } = installation;

    switch (type) {
      case InterventionType.DRAINAGE:
        realm.write(() => {
          installation.synced = false;
          // Update containers current load / fluid

          intervention.containerLoads.forEach(containerLoad => {
            const { containerUuid, load } = containerLoad;
            const container = containerRepository.find(containerUuid);

            if (container !== null) {
              container.fill(load);
              container.setLastIntervention(type, purpose);

              if (!container.article.fluid) {
                container.addCurrentFluid(circuit.fluid);
              }

              if (intervention.moveContainers) {
                container.moveTo(installation.site);
              }
            }
          });

          // Update circuit current load
          if (intervention.markAsEmpty) {
            circuit.empty();
          } else {
            circuit.drain(intervention.getLoadSum());
          }
        });
        break;

      case InterventionType.FILLING:
        realm.write(() => {
          installation.synced = false;
          // Update containers current load
          intervention.containerLoads.forEach(containerLoad => {
            const { containerUuid, load } = containerLoad;
            const container = containerRepository.find(containerUuid);

            if (container !== null) {
              container.drain(load);
              container.setLastIntervention(type, purpose);

              if (intervention.moveContainers) {
                container.moveTo(installation.site);
              }
            }
          });

          // Update circuit current load / fluid
          switch (purpose) {
            case Purpose.RETROFIT:
            case Purpose.COMMISSIONING:
              if (intervention.getLastContainerLoad()) {
                circuit.setFluid(fluidRepository.find(intervention.getLastContainerLoad().fluid));
                circuit.fill(intervention.getLoadSum(), intervention.updateNominalLoad);
              }
              break;

            default:
              circuit.fill(intervention.getLoadSum(), intervention.updateNominalLoad);
              break;
          }
        });
        break;

      case InterventionType.LEAK:
        realm.write(() => {
          intervention.leaks.forEach(leak => {
            if (!leak.repaired) {
              installation.addLeak(leak);
            }
          });
        });
        break;

      case InterventionType.LEAK_REPAIR:
        realm.write(() => {
          // For each repaired leak, mark as repaired and remove it from installation leaks,
          // + store the leak data to the intervention.
          intervention.leaks = intervention.repairedLeaks
            .map(repairedLeak => installation.removeLeakByUuid(repairedLeak.leakUuid))
            .filter(Boolean);
        });
        break;

      case InterventionType.COOLANT_DRAINAGE:
        realm.write(() => {
          installation.synced = false;
          // Update coolant load
          intervention.coolantContainers.forEach(coolantLoad => {
            if (circuit.coolantQuantity > 0) {
              const { load } = coolantLoad;
              circuit.drainCoolant(load);
            }
          });
        });
        break;
    }

    interventionRepository.save(intervention);

    dispatch({ type: INTERVENTION_SAVED, payload: { intervention } });
    dispatch(updateLocalModificationCount());
  };
}

/**
 * Reset intervention
 */
export function resetIntervention() {
  return dispatch => dispatch({ type: INTERVENTION_RESET });
}
