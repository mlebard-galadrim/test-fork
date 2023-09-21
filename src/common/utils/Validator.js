import I18n from 'i18n-js';
import Purpose from '../../intervention/models/Purpose';
import InterventionType from '../../intervention/models/InterventionType';
import Alert from './Alert';
import Pressure from 'k2/app/modules/nomenclature/models/Pressure';
import AnalysisNature from '../../analysis/models/AnalysisNature';

class Validator {
  /**
   * @param {Store}                  store                  Redux store
   * @param {InstallationRepository} installationRepository
   * @param {ArticleRepository}      articleRepository
   * @param {ArticleInterventionUnavailabilityRepository}      unavailabilityRepository
   * @param {FluidRepository}        fluidRepository
   * @param {ContainerRepository}    containerRepository
   * @param {InterventionRepository} interventionRepository
   * @param {Security}                security
   */
  constructor(
    store,
    installationRepository,
    articleRepository,
    unavailabilityRepository,
    fluidRepository,
    containerRepository,
    interventionRepository,
    security,
  ) {
    this.store = store;
    this.repositories = {
      installation: installationRepository,
      article: articleRepository,
      unavailability: unavailabilityRepository,
      fluid: fluidRepository,
      container: containerRepository,
      intervention: interventionRepository,
    };
    this.security = security;
  }

  isInterventionComplete() {
    const intervention = this.getCurrentIntervention();
    const { type, purpose, operatorSignature } = intervention;

    if (type === null || purpose === null) {
      return false;
    }
    if (!(type === InterventionType.COOLANT_DRAINAGE) && operatorSignature === null) {
      return false;
    }

    switch (type) {
      case InterventionType.DRAINAGE:
        return intervention.hasContainerLoads();

      case InterventionType.FILLING:
        return this.isPreFilledCommissioning() || intervention.hasContainerLoads();

      case InterventionType.LEAK_REPAIR:
        return intervention.hasRepairedLeaks();

      default:
        return true;
    }
  }

  /**
   * Rule validation:
   * The client user Certificate Of Professional Competence should be valid
   *
   * @param {Boolean} isIntervention
   *
   * @return {Boolean|Alert}
   */
  isCOPCValid(isIntervention) {
    if (!isIntervention) {
      return true;
    }

    const copc = this.security.getUserClient().certificateOfProfessionalCompetence;
    const currentDate = new Date();

    if (!copc) {
      return Alert.getWarningAlert('validator.copc:not_specified');
    }

    if (copc.startDate <= currentDate && copc.endDate >= currentDate) {
      return true;
    }

    return Alert.getWarningAlert('validator.copc:invalid');
  }

  /**
   * Ensure that the detector is not expired.
   *
   * @param {Detector} detector
   *
   * @return {Boolean|Alert}
   */
  isDetectorValid(detector) {
    if (detector.expired) {
      return Alert.getBlockingAlert('validator.detector:expired');
    }

    return true;
  }

  /**
   * Rule validation:
   * Current capacity installation is under 10%
   *
   * @return {Boolean}
   */
  mayDrainageInterventionIsEmpty() {
    const installation = this.getCurrentInstallation();
    const containerLoadsSum = this.getContainerLoadsSumValue();
    const installationCurrentLoad = installation.primaryCircuit.currentLoad;
    const installationNominalLoad = installation.primaryCircuit.nominalLoad;
    const currentLoad = installationCurrentLoad - containerLoadsSum;
    const ratio = currentLoad / installationNominalLoad;

    return ratio <= 0.1 && ratio > 0;
  }

  /**
   * Rule validation:
   * Current capacity installation is greater than nominal load
   *
   * @return {Boolean}
   */
  mayFillingInterventionUpdateNominalLoad() {
    const installation = this.getCurrentInstallation();
    const containerLoadsSum = this.getContainerLoadsSumValue();
    const installationCurrentLoad = installation.primaryCircuit.currentLoad;
    const installationNominalLoad = installation.primaryCircuit.nominalLoad;
    const currentLoad = installationCurrentLoad + containerLoadsSum;

    return currentLoad > installationNominalLoad;
  }

  /**
   * Rule validation:
   * Drainage loads can not be inferior to the current load of the installation
   *
   * @param {Number} currentLoad
   *
   * @return {Boolean|Alert}
   */
  isDrainageLoadPossible(currentLoad) {
    const installation = this.getCurrentInstallation();
    const containerLoadsSum = this.getContainerLoadsSumValue(false);
    const installationCurrentLoad = installation.primaryCircuit.currentLoad;

    if (currentLoad + containerLoadsSum <= installationCurrentLoad) {
      return true;
    }

    return Alert.getConfirmAlert('validator.drainage_load');
  }

  isCoolantDrainagePossible(drainedQuantity) {
    const installation = this.getCurrentInstallation();
    const coolantQuantity = installation.primaryCircuit.coolantQuantity;

    if (drainedQuantity <= coolantQuantity) {
      return true;
    }

    return Alert.getConfirmAlert('validator.coolant_drainage_load');
  }

  /**
   * Rule validation:
   * Filling loads can not exceed the nominal load of the installation
   *
   * @param {Number} currentLoad
   *
   * @return {Boolean|Alert}
   */
  isFillingLoadPossible(currentLoad) {
    const installation = this.getCurrentInstallation();
    const { intervention } = this.store.getState().interventionPipe;
    const containerLoadsSum = this.getContainerLoadsSumValue(false);
    const installationCurrentLoad = installation.primaryCircuit.currentLoad;
    const installationNominalLoad = installation.primaryCircuit.nominalLoad;

    if (
      intervention.purpose === Purpose.RETROFIT ||
      !installationNominalLoad ||
      currentLoad + containerLoadsSum + installationCurrentLoad <= installationNominalLoad
    ) {
      return true;
    }

    return Alert.getConfirmAlert('validator.filling_load_exceeded');
  }

  /**
   * Rule validation:
   * Selected container fluid should be equal to current installation fluid
   *
   * @param {Fluid|null} containerFluid
   *
   * @return {Boolean|Alert}
   */
  isContainerFluidValid(containerFluid) {
    const { purpose, type } = this.getCurrentIntervention();

    if (type === InterventionType.FILLING && !containerFluid) {
      return Alert.getBlockingAlert('validator.fluid_matching_filling');
    }

    switch (purpose) {
      // Drainage
      case Purpose.RECUPERATION:
      case Purpose.TRANSFER:
        return this.isContainerFluidValidForDrainage(containerFluid);

      // Filling
      case Purpose.MAINTENANCE_LOAD:
      case Purpose.FILLING_AFTER_TRANSFER:
        return this.isContainerFluidValidForFilling(containerFluid);

      case Purpose.COMMISSIONING:
        return this.isContainerFluidValidForCommissioning(containerFluid);

      case Purpose.RETROFIT:
        return this.isContainerFluidValidForRetrofit(containerFluid);

      default:
        throw new Error("Can't validate the fluid: The current intervention is not a filling nor a drainage.");
    }
  }

  isContainerFluidValidForFilling(containerFluid) {
    const installationFluid = this.getCurrentInstallation().primaryCircuit.fluid;

    if (installationFluid.uuid === containerFluid.uuid) {
      return true;
    }

    return Alert.getBlockingAlert('validator.fluid_matching', {
      installationFluid: installationFluid.designation,
      containerFluid: containerFluid.designation,
    });
  }

  isContainerFluidValidForCommissioning(containerFluid) {
    const matchPrevious = this.isContainerFluidValidForPreviousContainer(containerFluid);

    if (matchPrevious) {
      return matchPrevious;
    }

    const installationFluid = this.getCurrentInstallation().primaryCircuit.fluid;

    if (!installationFluid || installationFluid.uuid === containerFluid.uuid) {
      return true;
    }

    return Alert.getConfirmAlert('validator.fluid_matching', {
      installationFluid: installationFluid.designation,
      containerFluid: containerFluid.designation,
    });
  }

  isContainerFluidValidForRetrofit(containerFluid) {
    const matchPrevious = this.isContainerFluidValidForPreviousContainer(containerFluid);

    if (matchPrevious) {
      return matchPrevious;
    }

    const installationFluid = this.getCurrentInstallation().primaryCircuit.fluid;

    if (!installationFluid || installationFluid.uuid !== containerFluid.uuid) {
      return true;
    }

    return Alert.getBlockingAlert('validator.fluid_matching_retrofit', {
      containerFluid: containerFluid.designation,
    });
  }

  isContainerFluidValidForPreviousContainer(containerFluid) {
    const containerLoad = this.getCurrentIntervention().getFirstContainerLoad();

    if (!containerLoad || !containerLoad.fluid) {
      return null;
    }

    const previousFluid = this.repositories.fluid.find(containerLoad.fluid);

    if (previousFluid.uuid === containerFluid.uuid) {
      return true;
    }

    return Alert.getBlockingAlert('validator.fluid_matching_container', {
      installationFluid: previousFluid.designation,
      containerFluid: containerFluid.designation,
    });
  }

  isContainerFluidValidForDrainage(containerFluid) {
    const installationFluid = this.getCurrentInstallation().primaryCircuit.fluid;

    if (!containerFluid || installationFluid.uuid === containerFluid.uuid) {
      return true;
    }

    return Alert.getConfirmAlert('validator.fluid_matching', {
      installationFluid: installationFluid.designation,
      containerFluid: containerFluid.designation,
    });
  }

  /**
   * Rule validation:
   * Installation can not be maintained if it's empty
   *
   * @param {String} purpose
   *
   * @return {next|Alert}
   */
  validatePurpose(purpose) {
    const installation = this.getCurrentInstallation();

    if (this.isPreFilledCommissioning(installation, purpose)) {
      return Alert.getConfirmAlert('validator.commissioning_pre_filled');
    }

    if (!installation.isEmpty() && (purpose === Purpose.COMMISSIONING || purpose === Purpose.RETROFIT)) {
      return Alert.getBlockingAlert('validator.purpose_installation_not_empty', {
        purpose: I18n.t(`scenes.intervention.purpose.${Purpose.readableFor(purpose)}`),
      });
    }

    if (installation.isEmpty() && purpose === Purpose.MAINTENANCE_LOAD) {
      return Alert.getBlockingAlert('validator.maintenance_empty_installation');
    }

    return true;
  }

  isPreFilledCommissioning(installation = this.getCurrentInstallation(), purpose = this.getCurrentPurpose()) {
    return installation.isFull() && purpose === Purpose.COMMISSIONING;
  }

  /**
   * Rule validation:
   * Article must not be unavailable for this purpose
   *
   * @param {String} articleUuid
   *
   * @return {Boolean|Alert}
   */
  isArticleValid(articleUuid) {
    const { purpose } = this.getCurrentIntervention();
    const unavailability = this.repositories.unavailability.getUnavailability(articleUuid, purpose);

    return this.getUnavailabilityAlert(unavailability);
  }

  /**
   * @returns {true|Function}
   */
  getUnavailabilityAlert(unavailability) {
    if (unavailability) {
      const { blocking, purpose } = unavailability;
      const message = `validator.article_unavailable_for_purpose.${blocking ? 'blocking' : 'non-blocking'}.${purpose}`;

      return blocking ? Alert.getBlockingAlert(message) : Alert.getConfirmAlert(message);
    }

    return true;
  }

  /**
   * Is shipping valid?
   *
   * @param {Container} container
   *
   * @return {Boolean}
   */
  isShippingValid(container) {
    if (!container) {
      return false;
    }

    const { type } = this.getCurrentShipping();
    const { lastShippingType } = container;

    if (!lastShippingType || !type.is(lastShippingType)) {
      return true;
    }

    return Alert.getConfirmAlert(`validator.consecutive_shipping.${type}`);
  }

  /**
   * Rule validation:
   * Container article pressure must be >= installation circuit pressure
   *
   * @param {string|null} containerPressure
   *
   * @return {Boolean|Alert}
   */
  isContainerPressureValid(containerPressure) {
    const intervention = this.getCurrentIntervention();

    if (!intervention || intervention.type !== InterventionType.DRAINAGE) {
      return true;
    }

    const circuit = this.repositories.installation.find(intervention.installation).primaryCircuit;

    if (
      circuit.pressure === null ||
      containerPressure === null ||
      Pressure.compare(containerPressure, circuit.pressure) >= 0
    ) {
      return true;
    }

    return Alert.getBlockingAlert('validator.container_pressure:mismatch_installation_pressure');
  }

  /**
   * Is installation valid?
   *
   * @param {Installation} installation
   *
   * @return {Boolean}
   */
  isInstallationValid(installation) {
    const intervention = this.getCurrentIntervention();

    if (!intervention) {
      return true;
    }

    if (installation.disassemblyAt !== null) {
      return Alert.getBlockingAlert('validator.intervention_disassembled_installation');
    }

    const { type } = intervention;

    if (InterventionType.FILLING === type && installation.leaking) {
      return Alert.getBlockingAlert('validator.fill_leaking_installation');
    }

    const analysis = this.getCurrentAnalysis();
    if (analysis) {
      if (analysis === AnalysisNature.OIL) {
        if (!installation.canOilBeAnalyzed()) {
          return Alert.getBlockingAlert('validator.oil_analysis.installation_require_oil');
        }
        if (!installation.primaryCircuit.hasCompressor()) {
          return Alert.getBlockingAlert('validator.oil_analysis.installation_require_compressor');
        }
      }
    }

    return true;
  }

  /**
   * Rule validation:
   * Installation unicity
   *
   * @param {Site}         site
   * @param {Object}       data
   * @param {Installation} installation Installation to exclude from validation (for edition)
   *
   * @return {Boolean|Alert}
   */
  isInstallationUnique(site, data, installation = null) {
    const { barcode, reference } = data;
    let installations = Array.from(site.installations);

    if (installation) {
      installations = installations.filter(install => install.id !== installation.id);
    }

    if (reference !== null && installations.some(install => install.reference === reference)) {
      return Alert.getBlockingAlert('validator.installation_unicity:reference');
    }

    if (barcode !== null && installations.some(install => install.barcode === barcode)) {
      return Alert.getBlockingAlert('validator.installation_unicity:code');
    }

    return true;
  }

  /**
   * Rule validation:
   * Component unicity
   *
   * @param {Circuit}   circuit
   * @param {Object}    data
   * @param {Component} component Component to exclude from validation (for edition)
   *
   * @return {Boolean|Alert}
   */
  isComponentUnique(circuit, data, component = null) {
    const { barcode, mark } = data;
    let components = Array.from(circuit.components);

    if (component) {
      components = components.filter(comp => comp.uuid !== component.uuid);
    }

    if (mark !== null && components.some(comp => comp.mark === mark)) {
      return Alert.getBlockingAlert('validator.component_unicity:mark');
    }

    if (barcode !== null && components.some(comp => comp.barcode === barcode)) {
      return Alert.getBlockingAlert('validator.component_unicity:barcode');
    }

    return true;
  }

  /**
   * Is the given container positionned on the given site?
   *
   * @param {String} containerUuid
   *
   * @return {Alert|Boolean}
   */
  isContainerOnSite(containerUuid) {
    const { site } = this.getCurrentInstallation();
    const { moveContainersAsked } = this.getCurrentIntervention();
    const { lastPosition } = this.repositories.container.find(containerUuid);

    if (moveContainersAsked || lastPosition === null || lastPosition.isMobile() || lastPosition.is(site)) {
      return true;
    }

    return Alert.getConfirmAlert('validator.container_position');
  }

  /**
   * @return {Intervention}
   */
  getCurrentIntervention() {
    return this.store.getState().interventionPipe.intervention;
  }

  getCurrentAnalysis() {
    return this.store.getState().analysisPipe.analysis;
  }

  /**
   * @return {Object}
   */
  getCurrentShipping() {
    return this.store.getState().shippingReducer;
  }

  /**
   * @return {Object}
   */
  getCurrentPurpose() {
    return this.getCurrentIntervention().purpose;
  }

  /**
   * @param {Boolean} keepLastContainerLoad  Keep last containerLoad for the sum
   *
   * @return {Number}
   */
  getContainerLoadsSumValue(keepLastContainerLoad = true) {
    const { containerLoads } = this.getCurrentIntervention();

    return (keepLastContainerLoad ? containerLoads : containerLoads.slice(0, -1)).reduce(
      (sum, container) => sum + container.load,
      0,
    );
  }

  /**
   * @return {Installation}
   */
  getCurrentInstallation() {
    const { installation } = this.getCurrentIntervention();

    return this.repositories.installation.find(installation);
  }

  /**
   * @param {Container} source
   * @param {Container} target
   *
   * @return {Boolean|Function}
   */
  areDifferentContainers(source, target) {
    if (source.id === target.id) {
      return Alert.getBlockingAlert('validator.transfer.non_identical_containers');
    }

    return true;
  }

  /**
   * If the source container for transfer has no fluid, blocking alert, as we don't know what fluid to transfer.
   *
   * @param {Container} source
   * @returns {*}
   */
  hasFluid(source) {
    return source.fluid ? true : Alert.getBlockingAlert('validator.transfer.source_requires_fluid');
  }

  /**
   * For transfer, containers fluid MUST match.
   * Source fluid is mandatory, but target fluid can be null.
   *
   * @param {Container} source
   * @param {Container} target
   *
   * @return {Boolean|Function}
   */
  areContainersFluidsMatching(source, target) {
    if (!target.fluid) {
      return true;
    }

    if (!source.fluid || source.fluid.uuid !== target.fluid.uuid) {
      return Alert.getBlockingAlert('validator.transfer.non_identical_fluid');
    }

    return true;
  }

  isValidOperationLineNumber(lineNumber, barcode) {
    if (lineNumber === -1) {
      return Alert.getBlockingAlert('validator.ariane_operation_invalid_line', { barcode });
    }

    return true;
  }

  /**
   * Container article must be available either for transfer or recuperation
   *
   * @param {Container} container
   *
   * @return {Boolean|Function}
   */
  isContainerAvailableForTransfer(container) {
    const { article } = container;

    if (!article) {
      return true;
    }

    const results = [];
    for (const purpose of [Purpose.TRANSFER, Purpose.RECUPERATION]) {
      const result = this.getUnavailabilityAlert(
        this.repositories.unavailability.getUnavailability(article.uuid, purpose),
      );

      results.push(result);

      if (result === true) {
        // At least one of transfer or recup is OK
        return true;
      }
    }

    // None of the transfer or recup purposes are available,
    // show blocking alert with priority, warning otherwise:
    return results.find(a => a.blocking) || results[0];
  }

  /**
   * Ensure installation can be saved
   * Installation can't be saved if disassemblyAt is manually added
   * and there are unsynced interventions otherwise it results in an
   * API error
   * @param {Installation} installation
   */
  canInstallationBeUpdated(installation, updateData) {
    if (installation.disassemblyAt) {
      return true;
    }

    const { disassemblyAt } = updateData;

    if (!disassemblyAt) {
      return true;
    }

    const unsyncedForInstallation = this.repositories.intervention.findUnsyncedForInstallation(installation.id);

    if (unsyncedForInstallation.length === 0) {
      return true;
    }

    return Alert.getBlockingAlert('validator.disassembly_impossible');
  }

  /**
   * Validate the given test(s)
   *
   * @param {Boolean|Function|Boolean[]|Function[]} results The test result
   * @param {Function}         confirm Confirm callback
   * @param {Function}         cancel  Cancel callback
   */
  validate(results, confirm, cancel) {
    if (!Array.isArray(results)) {
      return results === true ? confirm() : results(cancel, confirm);
    }

    // Ensure blocking alerts are showing first:
    const blockingAlert = results.find(result => result !== true && result.blocking);
    const confirmAlert = results.find(result => result !== true);

    return blockingAlert || confirmAlert ? (blockingAlert || confirmAlert)(cancel, confirm) : confirm();
  }
}

export default Validator;
