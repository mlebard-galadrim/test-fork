import Fieldset from 'k2/app/modules/common/components/Fieldset';
import Definition from 'k2/app/modules/common/components/Definition';
import I18n from 'i18n-js';
import { fixed } from 'k2/app/modules/common/utils/filterUtils';
import React from 'react';
import PropTypes from 'prop-types';
import Container from 'k2/app/modules/container/models/Container';
import Site from 'k2/app/modules/installation/models/Site';
import TrackdechetsContainerInfo from 'k2/app/modules/container/scenes/TrackdechetsContainerInfo';

ContainerResultDetails.propTypes = {
  container: PropTypes.instanceOf(Container).isRequired,
  children: PropTypes.node,
};
ContainerResultDetails.defaultProps = {
  children: null,
};

/**
 * Container details displayed while searching for a container and getting results,
 * either for reading info or selecting a container in an intervention workflow.
 */
export default function ContainerResultDetails({ container, children }) {
  const { competitor, fluid, load, article, lastPosition } = container;
  const { quantity, volume } = article;

  return (
    <Fieldset title={article.designation}>
      <Definition
        label={I18n.t('components.container.container_form.competitor:label')}
        value={competitor?.designation ?? I18n.t('components.container.container_form.competitor:placeholder')}
      />
      <Definition
        label={I18n.t('components.container.container_form.fluid:label')}
        value={fluid?.designation ?? I18n.t('components.container.container_form.fluid:placeholder')}
      />
      <Definition label={I18n.t('components.container.container_form.load:label')} value={`${fixed(load)}kg`} />
      {Boolean(quantity) && (
        <Definition
          label={I18n.t('components.container.container_form.capacity:label')}
          value={`${fixed(quantity)}kg`}
        />
      )}
      {Boolean(volume) && (
        <Definition label={I18n.t('components.container.container_form.volume:label')} value={`${fixed(volume)}L`} />
      )}

      <RemainingSpace container={container} />
      <LastPosition site={lastPosition} />
      <TrackdechetsContainerInfo container={container} />

      {children}
    </Fieldset>
  );
}

RemainingSpace.propTypes = {
  container: PropTypes.instanceOf(Container).isRequired,
};

function RemainingSpace({ container }) {
  const { load, article } = container;

  if (article.volume === null || !container.fluid) {
    return null;
  }

  const capacity = article.getCapacity(container.fluid, 0);

  return (
    Boolean(capacity) && (
      <Definition
        label={I18n.t('components.container.container_form.remaining_space:label')}
        value={`${fixed(capacity - load)}kg`}
      />
    )
  );
}

LastPosition.propTypes = {
  site: PropTypes.instanceOf(Site),
};
LastPosition.defaultProps = {
  site: null,
};

function LastPosition({ site }) {
  if (!site) {
    return null;
  }

  return (
    <Definition label={I18n.t('scenes.container_infos.infos.site')} value={`${site.name} - ${site.client.name}`} />
  );
}
