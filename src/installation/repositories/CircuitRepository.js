import AbstractRepository from '../../common/repositories/AbstractRepository';
import Installation from '../models/Installation';
import Circuit from '../models/Circuit';

class CircuitRepository extends AbstractRepository {
  /**
   * @param {Realm} realm
   * @param {InstallationRepository} installationRepository
   * @param {OilRepository} oilRepository
   * @param {FluidRepository} fluidRepository
   * @param {CoolantRepository} coolantRepository
   * */
  constructor(realm, installationRepository, oilRepository, fluidRepository, coolantRepository) {
    super(realm, Circuit.schema);

    this.installationRepository = installationRepository;
    this.oilRepository = oilRepository;
    this.fluidRepository = fluidRepository;
    this.coolantRepository = coolantRepository;
  }

  /**
   * {@inheritDoc}
   */
  findAll() {
    return super.getTable().sorted('installation', 'index');
  }

  /**
   * @param {Circuit} circuit
   */
  save(circuit) {
    // We don't mutate original circuit given,
    // but create a copy to fix existing references
    const rawCircuit = Object.assign(new Circuit(), circuit);

    rawCircuit.installation = this.installationRepository.find(circuit.installation.id);

    if (circuit.fluid) {
      rawCircuit.fluid = this.fluidRepository.find(circuit.fluid.uuid);
    }

    if (circuit.oil) {
      rawCircuit.oil = this.oilRepository.find(circuit.oil.uuid);
    }

    if (circuit.coolant) {
      rawCircuit.coolant = this.coolantRepository.find(circuit.coolant.uuid);
    }

    const instance = super.save(rawCircuit);
    const { name, primaryKey } = Installation.schema;

    circuit.installation = this.realm
      .objects(name)
      .filtered(`${primaryKey} == $0`, circuit.installation[primaryKey])[0];

    this.realm.write(() => {
      if (instance.index >= circuit.installation.circuits.length) {
        circuit.installation.circuits.push(instance);
      } else {
        circuit.installation.circuits[instance.index] = instance;
      }
    });
  }
}

export default CircuitRepository;
