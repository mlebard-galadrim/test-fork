import { get } from 'k2/app/container';

export default class ClientExporter {
  constructor() {
    this.clientRepository = get('client_repository');
    this.clientInfosRepository = get('client_infos_repository');
    this.addressRepository = get('address_repository');

    this.getRaw = this.getRaw.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.clearUnSafeData = this.clearUnSafeData.bind(this);
    this.transformClientToResource = this.transformClientToResource.bind(this);
    this.finishExport = this.finishExport.bind(this);
  }

  getRaw() {
    const clients = this.clientRepository.findUnsynced();

    return { clients };
  }

  retrieve() {
    const { clients } = this.getRaw();

    return clients.map(this.transformClientToResource);
  }

  clearUnSafeData() {
    const clients = this.clientRepository.findUnsynced();

    clients.forEach(client => this.clientRepository.delete(client));
  }

  transformClientToResource(client) {
    const { id, name, distributor, infos, address } = client;
    const resource = { type: 'client' };

    if (!infos) {
      throw new Error('Client infos should not be empty');
    }

    if (!infos.parent) {
      throw new Error('Client parent should not be empty');
    }

    resource.data = {
      uuid: id,
      parentUuid: infos.parent.id,
      name,
      siret: infos.siret,
      vatCode: infos.vatCode,
      individual: infos.individual,
      address: address
        ? {
          street: address.street,
          addressAddition: address.addition,
          postal: address.postal,
          city: address.city,
          country: address.country,
        }
        : null,
      distributor,
    };

    return resource;
  }

  finishExport() {
    this.clientRepository.markAllAsSynced();

    this.clientRepository.findAll().forEach(client => {
      if (client.infos) {
        this.clientInfosRepository.delete(client.infos);
        delete client.infos;
      }

      if (client.address) {
        this.addressRepository.delete(client.address);
        delete client.address;
      }
    });
  }
}
