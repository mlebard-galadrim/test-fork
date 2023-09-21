import { get } from 'k2/app/container';

export default class SiteExporter {
  constructor() {
    this.siteRepository = get('site_repository');
    this.contactRepository = get('contact_repository');
    this.managerRepository = get('manager_repository');
    this.addressRepository = get('address_repository');

    this.getRaw = this.getRaw.bind(this);
    this.retrieve = this.retrieve.bind(this);
    this.clearUnSafeData = this.clearUnSafeData.bind(this);
    this.transformSiteToResource = this.transformSiteToResource.bind(this);
    this.finishExport = this.finishExport.bind(this);
  }

  getRaw() {
    const sites = this.siteRepository.findUnsynced();

    return { sites };
  }

  retrieve() {
    const { sites } = this.getRaw();

    return sites.map(this.transformSiteToResource);
  }

  clearUnSafeData() {
    const sites = this.siteRepository.findUnsynced();

    sites.forEach(site => this.siteRepository.delete(site));
  }

  transformSiteToResource(site) {
    const { id, name, client, treatmentSite, warehouse, contact, address, manager } = site;
    const resource = { type: 'site' };

    resource.data = {
      uuid: id,
      clientUuid: client.id,
      designation: name,
      treatmentSite,
      warehouse,
      address: address
        ? {
          street: address.street,
          addressAddition: address.addition,
          postal: address.postal,
          city: address.city,
          country: address.country,
        }
        : null,
      contact: contact
        ? {
          firstname: contact.firstname,
          lastname: contact.lastname,
          email: contact.email,
        }
        : null,
      siteResponsibleName: manager ? manager.name : null,
      siteResponsibleSignature: manager ? manager.signature : null,
    };

    return resource;
  }

  finishExport() {
    this.siteRepository.markAllAsSynced();

    this.siteRepository.findAll().forEach(site => {
      if (site.address) {
        this.addressRepository.delete(site.address);
        delete site.address;
      }

      if (site.contact) {
        this.contactRepository.delete(site.contact);
        delete site.contact;
      }

      if (site.manager) {
        this.managerRepository.delete(site.manager);
        delete site.manager;
      }
    });
  }
}
