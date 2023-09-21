import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { back } from 'k2/app/navigation';
import { Button } from 'k2/app/modules/common/components/form';
import { SPACING } from 'k2/app/modules/common/styles/vars';
import { updateContainer } from 'k2/app/modules/container/actions/containerPipe';
import ContainerForm from 'k2/app/modules/container/components/ContainerForm/ContainerForm';
import Intervention from 'k2/app/modules/intervention/models/Intervention';
import Installation from 'k2/app/modules/installation/models/Installation';
import { trans } from 'k2/app/I18n';
import { get } from 'k2/app/container';
import Container from 'k2/app/modules/container/models/Container';

UpdateContainer.propTypes = {
  next: PropTypes.func,
  nextMethod: PropTypes.string,
  update: PropTypes.func.isRequired,
  container: PropTypes.instanceOf(Container).isRequired,
  intervention: PropTypes.instanceOf(Intervention),
  installation: PropTypes.instanceOf(Installation),
  onContainerUpdated: PropTypes.func,
};

UpdateContainer.defaultProps = {
  next: null,
  nextMethod: undefined,
  interventionType: null,
  interventionPurpose: null,
  installation: null,
  onContainerUpdated: () => {},
};

function UpdateContainer({ next, nextMethod, container, installation, intervention, onContainerUpdated, update }) {
  const { styles, name } = UpdateContainer;

  function submit({ isValid, data }) {
    if (!isValid) {
      return;
    }

    const { designation, fluid, selectedArticle, load, capacity, volume, pressure, usage } = data;

    update(container, {
      load,
      fluid,
      selectedArticle,
      capacity,
      volume,
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

    const promise = onContainerUpdated(container);

    /**
     * onContainerUpdated can be a Promise to get a better control of when the navigation is triggered.
     */
    if (promise instanceof Promise) {
      return promise
        .then(goNext)
        .catch(reason => {
          console.warn(`Updated container was rejected by \`props.onContainerCreated()\` in \`${name}.js\``, {
            reason,
          });
        })
        .done();
    }

    return goNext();
  }

  return (
    <ContainerForm
      title={trans('scenes.container.update_container.title')}
      interventionType={intervention?.type ?? null}
      interventionPurpose={intervention?.purpose ?? null}
      installation={installation}
      isKnownContainer={!container.unknown}
      initialData={{
        barcode: container.barcode,
        load: container.load,
        competitor: container.competitor,
        fluid: container.fluid,
        article: container.article,
      }}
    >
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
          }
        >
          {trans('common.submit')}
        </Button>
      )}
    </ContainerForm>
  );
}

UpdateContainer.styles = {
  button: {
    margin: SPACING,
  },
};

export default connect(
  (state, { navigation }) => {
    const { intervention } = state.interventionPipe;

    return {
      intervention: intervention ?? null,
      installation: intervention?.installationId
        ? get('installation_repository').find(intervention.installationId)
        : null,
      container: navigation.getParam('container'),
      next: navigation.getParam('next'),
      nextMethod: navigation.getParam('nextMethod'),
      onContainerUpdated: navigation.getParam('onContainerUpdated'),
    };
  },
  dispatch => ({
    update: (container, newData) => dispatch(updateContainer(container, newData)),
  }),
)(UpdateContainer);
