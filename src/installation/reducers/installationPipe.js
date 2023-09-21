import {
  SELECT_CLIENT,
  INSTALLATION_CREATE_CLIENT,
  SELECT_SITE,
  INSTALLATION_CREATE_SITE,
  INSTALLATION_CREATE_INSTALLATION,
  INSTALLATION_EDIT_INSTALLATION,
  SELECT_INSTALLATION,
} from '../constants';

const initialState = {
  previousInstallation: null,
  client: null,
  site: null,
};

export default function installationPipe(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SELECT_CLIENT:
    case INSTALLATION_CREATE_CLIENT:
      return {
        ...state,
        client: payload.client,
        site: null,
      };

    case SELECT_SITE:
    case INSTALLATION_CREATE_SITE:
      return {
        ...state,
        client: payload.site ? payload.site.client : state.client,
        site: payload.site,
      };

    case INSTALLATION_CREATE_INSTALLATION:
    case INSTALLATION_EDIT_INSTALLATION:
      return {
        ...state,
        client: payload.installation.site ? payload.installation.site.client : state.client,
        site: payload.installation.site,
      };

    case SELECT_INSTALLATION:
      return {
        ...state,
        previousInstallation: payload.installation ? payload.installation.id : state.previousInstallation,
      };

    default:
      return state;
  }
}
