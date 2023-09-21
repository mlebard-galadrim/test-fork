import PropTypes from 'prop-types';
import Container from 'k2/app/modules/container/models/Container';
import Fieldset from 'k2/app/modules/common/components/Fieldset';
import Definition from 'k2/app/modules/common/components/Definition';
import I18n from 'i18n-js';
import { fixed } from 'k2/app/modules/common/utils/filterUtils';
import React from 'react';

/**
 * Container details shown on summary scenes.
 */
export default function ContainerDetails(props) {
  const { container, transPrefix, children } = props;
  const { competitor, fluid, load, article, lastPosition } = container;
  const { quantity, volume } = article;

  return (
    <Fieldset title={article.designation}>
      <Definition
        testID="origin"
        value={competitor ? competitor.designation : I18n.t(`${transPrefix}.competitor:placeholder`)}
        label={I18n.t(`${transPrefix}.competitor:label`)}
      />
      <Definition
        testID="fluid"
        value={fluid ? fluid.designation : I18n.t(`${transPrefix}.fluid:placeholder`)}
        label={I18n.t(`${transPrefix}.fluid:label`)}
      />
      <Definition testID="load" value={`${fixed(load)}kg`} label={I18n.t(`${transPrefix}.load:label`)} />
      {quantity ? (
        <Definition testID="quantity" value={`${fixed(quantity)}kg`} label={I18n.t(`${transPrefix}.capacity:label`)} />
      ) : null}
      {volume ? (
        <Definition testID="volume" value={`${fixed(volume)}L`} label={I18n.t(`${transPrefix}.volume:label`)} />
      ) : null}
      {renderRemainingSpace(container, transPrefix)}
      {renderSite(lastPosition, transPrefix)}
      {children}
    </Fieldset>
  );
}

ContainerDetails.propTypes = {
  children: PropTypes.node,
  container: PropTypes.instanceOf(Container).isRequired,
  transPrefix: PropTypes.string,
};

ContainerDetails.defaultProps = {
  children: null,
  transPrefix: 'components.container.container_details',
};

/**
 * @param {Container} container
 */
function renderRemainingSpace(container, transPrefix) {
  const { load, article, currentFluids } = container;

  if (article.volume === null || currentFluids.length !== 1) {
    return null;
  }

  const capacity = article.getCapacity(currentFluids[0]);

  return (
    <Definition
      testID="remaining-space"
      value={`${fixed(capacity - load)}kg`}
      label={I18n.t(`${transPrefix}.remaining_space:label`)}
    />
  );
}

/**
 * @param {Site} site
 */
function renderSite(site, transPrefix) {
  if (!site) {
    return null;
  }

  return (
    <Definition testID="site" value={`${site.name} - ${site.client.name}`} label={I18n.t(`${transPrefix}.site`)} />
  );
}
