import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { back } from 'k2/app/navigation';
import { Button } from 'k2/app/modules/common/components/form';
import { SPACING } from 'k2/app/modules/common/styles/vars';
import { createUnknownContainer, removeUnknownContainer } from 'k2/app/modules/container/actions/containerPipe';
import ContainerForm from 'k2/app/modules/container/components/ContainerForm/ContainerForm';
import Intervention from 'k2/app/modules/intervention/models/Intervention';
import Installation from 'k2/app/modules/installation/models/Installation';
import { trans } from 'k2/app/I18n';
import { get, useService } from 'k2/app/container';
import { useFocusEffect } from 'k2/app/modules/common/hooks/useFocusEffect';

CreateContainer.propTypes = {
  next: PropTypes.func,
  nextMethod: PropTypes.string,
  create: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  barcode: PropTypes.string,
  matchesExistingClimalifeContainer: PropTypes.bool,
  intervention: PropTypes.instanceOf(Intervention),
  installation: PropTypes.instanceOf(Installation),
  onContainerCreated: PropTypes.func,
};

CreateContainer.defaultProps = {
  barcode: '',
  matchesExistingClimalifeContainer: false,
  next: null,
  nextMethod: undefined,
  interventionType: null,
  interventionPurpose: null,
  installation: null,
  onContainerCreated: () => {},
};

function CreateContainer({
  next,
  nextMethod,
  barcode,
  matchesExistingClimalifeContainer,
  installation,
  intervention,
  onContainerCreated,
  create,
  remove,
}) {
  const { styles, name } = CreateContainer;

  function submit({ isValid, data }) {
    if (!isValid) {
      return;
    }

    const { barcode, designation, fluid, competitor, selectedArticle, load, capacity, volume, pressure, usage } = data;

    create({
      barcode,
      load,
      competitor,
      fluid,
      selectedArticle,
      volume,
      capacity,
      pressure,
      usage,
      designation,
    })
      .then(postSubmit)
      .done();
  }

  /**
   * After successful submit
   */
  function postSubmit(container) {
    const goNext = () => (next ? next(undefined, nextMethod) : back());

    const promise = onContainerCreated(container);

    /**
     * onContainerCreated can be a Promise to get a better control of when the navigation is triggered.
     */
    if (promise instanceof Promise) {
      return promise
        .then(goNext)
        .catch(reason => {
          console.warn(`New container was rejected by \`props.onContainerCreated()\` in \`${name}.js\``, { reason });
          // On such a case, the newly created container is removed, as invalid for the context.
          remove(container);
        })
        .done();
    }

    return goNext();
  }

  return (
    <ContainerForm
      title={trans('scenes.container.create_container.title')}
      interventionType={intervention?.type ?? null}
      interventionPurpose={intervention?.purpose ?? null}
      allowEmptyCompetitor={!matchesExistingClimalifeContainer}
      installation={installation}
      forBarcode={barcode}>
      {/* Submit button */}
      {({ isValid, data }) => (
        <Button
          style={styles.button}
          valid={isValid}
          onPress={() =>
            submit({
              isValid,
              data,
            })
          }>
          {trans('common.submit')}
        </Button>
      )}
    </ContainerForm>
  );
}

CreateContainer.styles = {
  button: {
    margin: SPACING,
  },
};

export default connect(
  (state, { navigation }) => {
    const { intervention } = state.interventionPipe;
    const barcode = navigation.getParam('barcode');

    return {
      intervention: intervention ?? null,
      installation: intervention?.installationId
        ? get('installation_repository').find(intervention.installationId)
        : null,
      matchesExistingClimalifeContainer: get('container_repository').hasClimalifeContainerForBarcode(barcode),
      barcode,
      next: navigation.getParam('next'),
      nextMethod: navigation.getParam('nextMethod'),
      onContainerCreated: navigation.getParam('onContainerCreated'),
    };
  },
  dispatch => ({
    create: data => dispatch(createUnknownContainer(data)),
    remove: container => dispatch(removeUnknownContainer(container)),
  }),
)(CreateContainer);

/**
 * Determine if we allow to create or not a new container for the barcode.
 *
 * @param {String} barcode
 * @param {Number} attemptNb increment to force refresh of the existing containers
 *
 * @return {Boolean}
 */
export function useCanCreateContainer(barcode, attemptNb) {
  const containerRepository = useService('container_repository');
  const competitorRepository = useService('competitor_repository');

  const competitorUids = useMemo(
    () =>
      Array.from(competitorRepository.findAll())
        .map(c => c.uuid)
        .concat([null]),
    [competitorRepository],
  );

  /**
   * Fetches competitor from containers with the given barcode.
   */
  const existingContainersCompetitorsUids = useMemo(
    () =>
      containerRepository.search(barcode).reduce((uids, container) => {
        if (container.competitor && !uids.includes(container.competitor.uuid)) {
          uids.push(container.competitor.uuid);
        } else if (!container.competitor && !uids.includes(null)) {
          uids.push(null);
        }

        return uids;
        // Force refresh on attemptNb change
      }, []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [barcode, attemptNb, containerRepository],
  );

  /**
   * Cannot create a new container if there is already a container with the same barcode for every competitor:
   */
  return useMemo(
    () => !competitorUids.every(uid => existingContainersCompetitorsUids.includes(uid)),
    [competitorUids, existingContainersCompetitorsUids],
  );
}

/**
 * useCanCreateContainer with refresh on focus.
 */
export function useCanCreateContainerWithFocus(barcode) {
  const [attemptNb, setAttemptNb] = useState(0);
  useFocusEffect(() => {
    setAttemptNb(attemptNb + 1);
  });

  return useCanCreateContainer(barcode, attemptNb);
}
