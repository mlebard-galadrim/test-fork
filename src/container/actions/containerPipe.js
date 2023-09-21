import { get } from 'k2/app/container';
import { updateLocalModificationCount } from 'k2/app/modules/authentication/actions/authenticationActions';
// noinspection ES6UnusedImports
import ContainerModel from 'k2/app/modules/container/models/Container'; // eslint-disable-line no-unused-vars
// noinspection ES6UnusedImports
import CreateContainer from 'k2/app/modules/container/scenes/CreateContainer'; // eslint-disable-line no-unused-vars

/**
 * Create a new unknown container
 */
export function createUnknownContainer({
  barcode,
  load,
  competitor,
  fluid,
  selectedArticle,
  capacity,
  volume,
  pressure,
  usage,
  designation,
}) {
  const containerRepository = get('container_repository');
  const articleRepository = get('article_repository');
  const realm = get('realm');

  return dispatch => {
    return new Promise(resolve => {
      // Either use the explicitly selected article, or find an existing one with same criteria:
      let article = selectedArticle || articleRepository.findByUniqueCriteria(fluid, capacity, volume, competitor);
      let container = null;

      // Wrap in a single transaction:
      realm.write(() => {
        // If no article was selected nor found matching criteria, let's create a new one:
        if (article === null) {
          article = articleRepository.create(designation, fluid, capacity, volume, pressure, competitor, usage);
        } else if (!selectedArticle) {
          // If the article was not explicitly selected, but we found a match,
          // force update the article usage & pressure with explicitly provided data and require new sync:
          articleRepository.update(article, pressure, usage);
        }

        // Find existing container for criteria, or create a new one:
        container = containerRepository.updateOrCreate(barcode, article, fluid, load, competitor);
      });

      resolve(container);
      dispatch(updateLocalModificationCount());
    });
  };
}

/**
 * Update an existing unknown container
 *
 * @param {ContainerModel} container
 * @param {Object} newData
 */
export function updateContainer(container, newData) {
  if (container.unknown) {
    return updateUnknownContainer(container, newData);
  }

  return updateKnownContainer(container, newData);
}

/**
 * Update an existing known container (only load)
 *
 * @param {ContainerModel} container
 * @param {Object} newData
 */
export function updateKnownContainer(container, { load }) {
  const realm = get('realm');

  return dispatch => {
    return new Promise(resolve => {
      realm.write(() => {
        // Mark to be synced and update load:
        container.updateKnown(load);
      });

      resolve(container);
      dispatch(updateLocalModificationCount());
    });
  };
}

/**
 * Update an existing unknown container
 *
 * @param {ContainerModel} container
 * @param {Object} newData
 */
export function updateUnknownContainer(
  container,
  // New data:
  {
    load,
    fluid,
    // Selected, existing article:
    selectedArticle,
    // New article data:
    volume,
    capacity,
    pressure,
    usage,
    designation,
  },
) {
  return dispatch => {
    const articleRepository = get('article_repository');
    const realm = get('realm');
    // competitor never changes:
    const competitor = container?.competitor;

    return new Promise(resolve => {
      // Either use the explicitly selected article, or find an existing one with same criteria:
      let article = selectedArticle || articleRepository.findByUniqueCriteria(fluid, capacity, volume, competitor);

      // Wrap in a single transaction:
      realm.write(() => {
        // If no article was selected nor found matching criteria, let's create a new one:
        if (article === null) {
          article = articleRepository.create(designation, fluid, capacity, volume, pressure, competitor, usage);
        } else if (!selectedArticle) {
          // If the article was not explicitly selected, but we found a match,
          // force update the article usage & pressure with explicitly provided data and require new sync:
          articleRepository.update(article, pressure, usage);
        }

        // Mark to be synced & update the container
        container.updateUnknown(article, fluid, load);
      });

      resolve(container);
      dispatch(updateLocalModificationCount());
    });
  };
}

/**
 * Deletes a container. This only happens when rejected a newly created container during an intervention.
 * There is no container deletion in the app.
 * @link CreateContainer screen
 */
export function removeUnknownContainer(container) {
  const containerRepository = get('container_repository');

  return dispatch => {
    containerRepository.delete(container);

    dispatch(updateLocalModificationCount());
  };
}
