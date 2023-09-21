import UUID from 'react-native-uuid';
import InterventionType from '../../intervention/models/InterventionType';
import Purpose from '../../intervention/models/Purpose';
import ShippingType from '../../shipping/models/ShippingType';

/**
 * A container as synced with the API.
 *
 * @property {Site|null} lastPosition
 * @property {Article} article
 * @property {String} barcode
 * @property {Competitor} competitor
 * @property {Number} load        Tracks the current load of the container, applying interventions diff locally.
 * @property {Number} initialLoad Tracks the initial load of the container
 *                                (before any pending intervention applies a diff to reflect the current load)
 * @property {Boolean} archived   The container was archived from the BO (only for unknown containers).
 */
class Container {
  /**
   * @private
   */
  constructor() {
    // noop for realm
  }

  static createUnknown(barcode, article, fluid, load, competitor) {
    const instance = new this();

    instance.id = UUID.v4();
    instance.barcode = barcode.trim();
    instance.article = article;
    // Only set the initial fluid if there is none on the article:
    instance.currentFluids = fluid && !article.fluid ? [fluid] : [];
    instance.load = load;
    instance.initialLoad = load;
    instance.competitor = competitor;

    instance.lastPosition = null;
    instance.lastInterventionPurpose = null;
    instance.lastShippingType = null;

    instance.unknown = true;
    instance.toReset = false;
    instance.synced = false;

    instance.localUpdatedAt = null;
    instance.updatedAt = new Date();
    instance.archived = false;

    return instance;
  }

  /**
   * @param {String}                        id
   * @param {String}                        barcode
   * @param {Article}                       article
   * @param {Fluid[]}                       currentFluids
   * @param {Number}                        load
   * @param {InterventionType|String|null}  lastInterventionType    One of InterventionType values (or an instance)
   * @param {Purpose|String|null}           lastInterventionPurpose One of Purpose values (or an instance)
   * @param {ShippingType|String|null}      lastShippingType        One of ShippingType values (or an instance)
   * @param {Site|null}                     lastPosition            Site
   * @param {Competitor}                    competitor
   * @param {Boolean}                       unknown                 The container is not officially known by Climalife
   * @param {Boolean}                       toReset
   * @param {Date}                          updatedAt
   * @param {Boolean}                       archived                The container was archived from the BO.
   *
   * @return {Container}
   */
  static fromApi(
    id,
    barcode,
    article,
    currentFluids,
    load,
    lastInterventionType,
    lastInterventionPurpose,
    lastShippingType,
    lastPosition,
    competitor,
    unknown,
    toReset,
    updatedAt,
    archived,
  ) {
    const instance = new this();

    instance.id = id;
    instance.barcode = barcode.trim();
    instance.article = article;
    instance.currentFluids = currentFluids;
    instance.load = load;
    instance.initialLoad = load;
    instance.competitor = competitor;

    instance.lastPosition = lastPosition;
    instance.setLastIntervention(lastInterventionType, lastInterventionPurpose);
    instance.setLastShippingType(lastShippingType);

    instance.unknown = unknown;
    instance.toReset = toReset;
    instance.synced = true;

    instance.localUpdatedAt = null;
    instance.updatedAt = updatedAt;
    instance.archived = archived;

    return instance;
  }

  /**
   * Updates an existing unknown container.
   */
  updateUnknown(article, fluid, load) {
    this.article = article;
    // Updates the fluid (only if the article does not already define one):
    if (!this.article.fluid) {
      if (fluid) {
        // replace if there is a new one:
        this.replaceCurrentFluid(fluid);
      } else {
        // reset if there is none:
        this.currentFluids = [];
      }
    }

    this.load = load;
    this.initialLoad = load;
    // Mark the container as updated if it was already synced (otherwise it's still a creation)
    if (this.synced) {
      this.localUpdatedAt = new Date();
      this.updatedAt = new Date();

      // If it was archived in between, re-enable it.
      // It might happen when trying to create a container with same criteria as an existing archived one.
      if (this.archived) {
        this.archived = false;
      }
    }
  }

  /**
   * Updates an existing known container. Can only change the current load.
   */
  updateKnown(load) {
    this.load = load;
    this.initialLoad = load;
    // Only synced known containers can be updated, so it's always an update:
    this.localUpdatedAt = new Date();
    this.updatedAt = new Date();
  }

  /**
   * @internal Used-by {@link Transfer.create}
   *
   * @param {Transfer} transfer
   */
  useInTransferAsSource(transfer) {
    this.drain(transfer.transferredLoad);
  }

  /**
   * @internal Used-by {@link Transfer.create}
   *
   * @param {Transfer} transfer
   */
  useInTransferAsTarget(transfer) {
    this.fill(transfer.transferredLoad);

    if (!this.article.fluid && transfer.source.fluid) {
      this.addCurrentFluid(transfer.source.fluid);
    }
  }

  /**
   * @return {Fluid|null} The article fluid or the first known fluid known to have been transferred to the container
   */
  get fluid() {
    if (this.article.fluid) {
      return this.article.fluid;
    }

    if (this.currentFluids.length === 1) {
      return this.currentFluids[0];
    }

    return null;
  }

  addCurrentFluid(fluid) {
    if (this.article.fluid) {
      throw new Error('You can only set the fluid of a container that has no fluid associated to its article.');
    }

    if (!this.currentFluids.some(item => item.uuid === fluid.uuid)) {
      this.currentFluids.push(fluid);
    }
  }

  replaceCurrentFluid(fluid) {
    if (this.article.fluid) {
      throw new Error('You can only replace the fluid of a container that has no fluid associated to its article.');
    }

    if (fluid === this.fluid) {
      // This is already the current fluid known for the container, noop.
      return;
    }

    // Reset the known fluids with the new one:
    this.currentFluids = [fluid];
  }

  /**
   * Recursively clone the object
   *
   * @return {Container}
   */
  clone() {
    return Object.assign(new Container(), this);
  }

  /**
   * Remove fluid from the container load
   *
   * @param {Number} load
   */
  drain(load) {
    if (this.toReset) {
      this.reset(this.article.quantity || 0.0);
    }

    this.load = Math.max(this.load - load, 0);
  }

  /**
   * Add fluid to the container load
   *
   * @param {Number} load
   */
  fill(load) {
    if (this.toReset) {
      this.reset(0.0);
    }

    this.load += load;
  }

  /**
   * @param {Number} quantity
   */
  reset(quantity) {
    this.load = quantity;
    this.toReset = false;
    this.currentFluids = [];
    this.lastInterventionType = null;
    this.lastInterventionPurpose = null;
    this.lastShippingType = null;
    this.lastPosition = null;
  }

  /**
   * Move container to site
   *
   * @param {Site} site
   */
  moveTo(site) {
    this.lastPosition = site;
  }

  setLastIntervention(lastInterventionType, lastInterventionPurpose) {
    this.lastInterventionType = InterventionType.parse(lastInterventionType);
    this.lastInterventionPurpose = Purpose.parse(lastInterventionPurpose);
  }

  setLastShippingType(lastShippingType) {
    this.lastShippingType = ShippingType.parse(lastShippingType);
  }

  /**
   * Get filling ratio
   *
   * @param {Number} load
   * @param {Fluid|null} fluid
   *
   * @return {Number}
   */
  getRatio(load = 0, fluid = null) {
    const capacity = this.article.getCapacity(fluid);

    if (capacity === null) {
      return null;
    }

    return (this.load + load) / capacity;
  }

  /**
   * Get capacity of the given container according to article capacity, or the current load with excess
   *
   * @param {Fluid} fluid The fluid to use as reference for computing the capacity.
   *                      Defaults to the container's article's fluid, but should be used with a different fluid in
   *                      some contexts. E.g: when performing a Transfer operation, use the source fluid.
   *
   * @return {Number}
   */
  getCapacityWithExcess(fluid = this.fluid) {
    const currentLoad = this.toReset ? 0.0 : this.load;

    return Math.max(this.article.getCapacity(fluid), currentLoad);
  }

  /**
   * Get the container current load, accounting for toReset flag.
   *
   * @param {Boolean} forFilling If you aim to fill or drain the container
   *
   * @return {Number|null} Null if the container is to reset with an article without quantity
   */
  getCurrentLoad(forFilling = false) {
    let currentLoad = this.load;

    // fake the current load if the container has to be reset
    // by reusing the article quantity on for source (draining from), or 0.0 on target (filling into):
    if (this.toReset) {
      currentLoad = forFilling ? 0.0 : this.article.quantity;
    }

    return currentLoad;
  }
}

Container.schema = {
  name: 'Container',
  primaryKey: 'id',
  properties: {
    id: 'string',
    barcode: 'string',
    load: 'double',
    initialLoad: 'double',
    article: 'Article',
    currentFluids: { type: 'list', objectType: 'Fluid' },
    lastInterventionType: { type: 'string', optional: true },
    lastInterventionPurpose: { type: 'string', optional: true },
    lastShippingType: { type: 'string', optional: true },
    lastPosition: 'Site',
    competitor: 'Competitor',
    toReset: 'bool',
    unknown: 'bool',
    /** Means that the object has been created locally since the last sync. */
    synced: 'bool',
    /** Means that the object has been updated locally since the last sync. */
    localUpdatedAt: { type: 'date', optional: true },
    updatedAt: { type: 'date', optional: true },
    archived: { type: 'bool', default: false },
  },
};

export default Container;
