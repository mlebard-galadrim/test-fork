import UUID from 'react-native-uuid';
import { get } from 'k2/app/container';
import Client from '../models/Client';
import ClientInfos from '../models/ClientInfos';
import Site from '../models/Site';
import Installation from '../models/Installation';
import Component from '../models/Component';
import Address from '../models/Address';
import Manager from '../models/Manager';
import Contact from '../models/Contact';
import ClientType from 'k2/app/modules/installation/models/ClientType';
import { updateLocalModificationCount } from '../../authentication/actions/authenticationActions';
import {
  INSTALLATION_CREATE_CLIENT,
  INSTALLATION_CREATE_SITE,
  INSTALLATION_CREATE_INSTALLATION,
  INSTALLATION_EDIT_INSTALLATION,
  INSTALLATION_CREATE_COMPONENT,
  INSTALLATION_EDIT_COMPONENT,
  INSTALLATION_DELETE_COMPONENT,
} from '../constants';

export function saveNewClient(data) {
  const client = Client.create(UUID.v4(), null, data.legalCompanyName, ClientType.FINAL, [], false, null, true);

  client.infos = get('client_infos_repository').save(
    ClientInfos.create(data.parent, data.siret, data.vatCode, data.individual),
  );

  client.address = get('address_repository').save(
    Address.create(data.street, data.addressAddition, data.postal, data.city, data.country),
  );

  const instance = get('client_repository').save(client);

  get('firebase-analytics').logEvent('client_create_ok');

  if (data.createSite) {
    const site = Site.create(UUID.v4(), data.legalCompanyName, data.city, instance);

    site.address = get('address_repository').save(
      Address.create(data.street, data.addressAddition, data.postal, data.city, data.country),
    );

    get('site_repository').save(site);
  }

  return dispatch => {
    dispatch({
      type: INSTALLATION_CREATE_CLIENT,
      payload: { client: instance },
    });
    dispatch(updateLocalModificationCount());
  };
}

export function saveNewSite(data) {
  const site = Site.create(
    UUID.v4(),
    data.designation,
    data.city,
    data.client,
    null,
    null,
    data.type === 'treatment',
    data.type === 'warehouse',
  );

  if (data.managerName) {
    site.manager = get('manager_repository').save(Manager.create(data.managerName));
  }

  if (data.contactEmail) {
    site.contact = get('contact_repository').save(
      Contact.create(data.contactLastname, data.contactFirstname, data.contactEmail),
    );
  }

  site.address = get('address_repository').save(
    Address.create(data.street, data.addressAddition, data.postal, data.city, data.country),
  );
  const instance = get('site_repository').save(site);

  get('firebase-analytics').logEvent('site_create_ok');

  return dispatch => {
    dispatch({
      type: INSTALLATION_CREATE_SITE,
      payload: { site: instance },
    });
    dispatch(updateLocalModificationCount());
  };
}

/**
 * Create new installation
 *
 * @param {Object} data
 */
export function saveNewInstallation(data) {
  const installationRepository = get('installation_repository');
  const circuitRepository = get('circuit_repository');

  const installation = Installation.create(
    data.id ?? UUID.v4(),
    data.reference,
    data.barcode,
    data.name,
    data.site,
    data.technology,
    data.application,
    data.commissioningDate,
    [],
    [],
    data.type,
    false,
    data.integratedLeakDetector,
    data.lastLeakDetectionDate,
    data.assemblyAt,
    data.disassemblyAt,
  );

  const instance = installationRepository.save(installation);

  const primaryCircuit = installation.createCircuit(
    data.primaryFluid,
    data.primaryOil,
    data.coolant,
    data.currentLoad ? parseFloat(data.currentLoad) : 0,
    data.nominalLoad ? parseFloat(data.nominalLoad) : 0,
    data.primaryOilQuantity ? parseFloat(data.primaryOilQuantity) : 0,
    data.coolantQuantity ? parseFloat(data.coolantQuantity) : 0,
    data.coolantLevelPercent ? parseFloat(data.coolantLevelPercent) : 0,
    [],
    data.primaryCircuitPressure,
    data.primaryAntacid,
    data.primaryOil ? null : data.primaryOtherOilName,
  );
  circuitRepository.save(primaryCircuit);

  if (data.secondaryFluid) {
    const secondaryCircuit = installation.createCircuit(data.secondaryFluid, data.secondaryOil);

    circuitRepository.save(secondaryCircuit);
  }

  get('firebase-analytics').logEvent('installation_create_ok');

  return dispatch => {
    dispatch({
      type: INSTALLATION_CREATE_INSTALLATION,
      payload: { installation: instance },
    });
    dispatch(updateLocalModificationCount());
  };
}

/**
 * Edit an existing installation
 *
 * @param {Object} data
 */
export function saveInstallation(data) {
  const realm = get('realm');
  const installationRepository = get('installation_repository');
  const circuitRepository = get('circuit_repository');
  const installation = installationRepository.find(data.id);

  realm.write(() => {
    installation.reference = data.reference;
    installation.barcode = data.barcode;
    installation.name = data.name;
    installation.technology = data.technology;
    installation.application = data.application;
    installation.commissioningDate = data.commissioningDate;
    installation.type = data.type;
    installation.integratedLeakDetector = data.integratedLeakDetector;
    installation.lastLeakDetectionDate = data.lastLeakDetectionDate;
    installation.assemblyAt = data.assemblyAt ?? null;
    installation.disassemblyAt = data.disassemblyAt ?? null;
    installation.synced = false;

    installation.primaryCircuit.fluid = data.primaryFluid;
    installation.primaryCircuit.oil = data.primaryOil;
    installation.primaryCircuit.otherOilName = data.primaryOil ? null : data.primaryOtherOilName;
    installation.primaryCircuit.coolant = data.coolant;
    installation.primaryCircuit.currentLoad = data.currentLoad ? parseFloat(data.currentLoad) : 0;
    installation.primaryCircuit.nominalLoad = data.nominalLoad ? parseFloat(data.nominalLoad) : 0;
    installation.primaryCircuit.oilQuantity = data.primaryOilQuantity ? parseFloat(data.primaryOilQuantity) : 0;
    installation.primaryCircuit.coolantQuantity = data.coolantQuantity ? parseFloat(data.coolantQuantity) : 0;
    installation.primaryCircuit.coolantLevelPercent = data.coolantLevelPercent
      ? parseFloat(data.coolantLevelPercent)
      : 0;
    installation.primaryCircuit.otherCoolantName = data.coolant ? null : data.otherCoolantName;
    installation.primaryCircuit.pressure = data.primaryCircuitPressure;
    installation.primaryCircuit.antacid = data.primaryAntacid;

    if (data.secondaryFluid) {
      if (!installation.secondaryCircuit) {
        circuitRepository.save(installation.createCircuit(data.secondaryFluid, data.secondaryOil));
      } else {
        installation.secondaryCircuit.fluid = data.secondaryFluid;
        installation.secondaryCircuit.oil = data.secondaryOil;
      }
    } else if (installation.secondaryCircuit) {
      circuitRepository.delete(installation.removeCircuit(installation.secondaryCircuit));
    }
  });

  get('firebase-analytics').logEvent('installation_edit_ok');

  return dispatch => {
    dispatch({
      type: INSTALLATION_EDIT_INSTALLATION,
      payload: { installation },
    });
    dispatch(updateLocalModificationCount());
  };
}

/**
 * Create new component
 *
 * @param {Object} data
 */
export function saveNewComponent(data) {
  const componentRepository = get('component_repository');

  const component = Component.create(
    UUID.v4(),
    data.circuit,
    data.nature,
    data.designation,
    data.mark,
    data.barcode,
    data.natureClassification,
    data.natureType,
    data.commissioningDate,
    data.brand,
    data.brandOther,
    data.model,
    data.serialNumber,
    data.usagePercent,
  );

  componentRepository.save(component);

  return dispatch => {
    dispatch({ type: INSTALLATION_CREATE_COMPONENT, payload: { component } });
    dispatch(updateLocalModificationCount());
  };
}

/**
 * Edit an existing component
 *
 * @param {Object} data
 */
export function saveComponent(data) {
  const realm = get('realm');
  const componentRepository = get('component_repository');
  const component = componentRepository.find(data.uuid);

  realm.write(() => {
    component.nature = data.nature;
    component.designation = data.designation;
    component.mark = data.mark;
    component.barcode = data.barcode;
    component.natureClassification = data.natureClassification;
    component.natureType = data.natureType;
    component.commissioningDate = data.commissioningDate;
    component.brand = data.brand;
    component.brandOther = data.brandOther;
    component.model = data.model;
    component.serialNumber = data.serialNumber;
    component.usagePercent = data.usagePercent;
    component.synced = false;
  });

  return dispatch => {
    dispatch({ type: INSTALLATION_EDIT_COMPONENT, payload: { component } });
    dispatch(updateLocalModificationCount());
  };
}

/**
 * Delete an existing component
 *
 * @param {String} componentUuid
 */
export function deleteComponent(componentUuid) {
  const realm = get('realm');
  const componentRepository = get('component_repository');
  const component = componentRepository.find(componentUuid);
  const { circuit } = component;

  componentRepository.delete(component);
  realm.write(() => {
    circuit.installation.synced = false;
  });

  return dispatch => {
    dispatch({ type: INSTALLATION_DELETE_COMPONENT, payload: { circuit } });
    dispatch(updateLocalModificationCount());
  };
}
