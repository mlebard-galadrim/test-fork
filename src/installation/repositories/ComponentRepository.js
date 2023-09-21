import AbstractRepository from '../../common/repositories/AbstractRepository';
import Component from '../models/Component';
import Circuit from '../models/Circuit';

class ComponentRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   */
  constructor(realm) {
    super(realm, Component.schema);
  }

  /**
   * {@inheritDoc}
   */
  findAll() {
    return super.findAll().sorted('barcode');
  }

  /**
   * @param {Circuit} circuit
   *
   * @return {RealmResults}
   */
  findForCircuit(circuit) {
    return super.getTable().filtered('circuit.id == $0', circuit.id).sorted('barcode');
  }

  /**
   * @param {Component} component
   */
  save(component) {
    const instance = super.save(component);
    const { name, primaryKey } = Circuit.schema;

    component.circuit = this.realm.objects(name).filtered(`${primaryKey} == $0`, component.circuit[primaryKey])[0];

    this.realm.write(() => component.circuit.components.push(instance));

    return instance;
  }
}

export default ComponentRepository;
