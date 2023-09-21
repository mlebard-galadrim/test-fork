import {
  SELECT_CLIENT,
  SELECT_SITE,
  SELECT_INSTALLATION,
  SELECT_CIRCUIT,
  SELECT_COMPONENT,
  INSTALLATION_CREATE_INSTALLATION,
  INSTALLATION_EDIT_INSTALLATION,
  INSTALLATION_CREATE_SITE,
  INSTALLATION_CREATE_COMPONENT,
  INSTALLATION_EDIT_COMPONENT,
  INSTALLATION_DELETE_COMPONENT,
} from '../constants';

const initialState = {
  installation: null,
  circuit: null,
  component: null,
};

export default function installationManagementReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SELECT_CLIENT:
    case SELECT_SITE:
    case INSTALLATION_CREATE_SITE:
      return {
        ...state,
        installation: null,
        component: null,
        circuit: null,
      };

    case SELECT_INSTALLATION:
    case INSTALLATION_CREATE_INSTALLATION:
    case INSTALLATION_EDIT_INSTALLATION:
      return {
        ...state,
        installation: payload.installation,
        circuit: null,
        component: null,
      };

    case SELECT_CIRCUIT:
      return {
        ...state,
        installation: payload.circuit.installation,
        circuit: payload.circuit,
      };

    case SELECT_COMPONENT:
      return {
        ...state,
        component: payload.component,
      };

    case INSTALLATION_CREATE_COMPONENT:
    case INSTALLATION_EDIT_COMPONENT:
      return {
        ...state,
        installation: payload.component.circuit.installation,
        circuit: payload.component.circuit,
      };

    case INSTALLATION_DELETE_COMPONENT:
      return {
        ...state,
        installation: payload.circuit.installation,
        circuit: payload.circuit,
      };

    default:
      return state;
  }
}
