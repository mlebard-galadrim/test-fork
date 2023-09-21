import React from 'react';
import PropTypes from 'prop-types';
import { trans } from 'k2/app/I18n';
import Select from 'k2/app/modules/common/components/form/Select';
import Article from 'k2/app/modules/nomenclature/models/Article';
import Purpose from 'k2/app/modules/intervention/models/Purpose';
import InterventionType from 'k2/app/modules/intervention/models/InterventionType';
import { get } from 'k2/app/container';
import Pressure from 'k2/app/modules/nomenclature/models/Pressure';
import { alphabetically, numerically } from 'k2/app/modules/common/utils/filterUtils';

SelectArticle.propTypes = {
  value: PropTypes.instanceOf(Article),
  onChangedValue: PropTypes.func.isRequired,
  required: PropTypes.bool,
  articles: PropTypes.arrayOf(PropTypes.instanceOf(Article)).isRequired,
  disabled: PropTypes.bool,
};

SelectArticle.defaultProps = {
  value: null,
  required: false,
  disabled: false,
};

export default function SelectArticle({ value, articles, onChangedValue, required, disabled }) {
  return (
    <Select
      hideOnNoOptions={false}
      disabled={disabled}
      title={trans('components.container.container_form.article:label')}
      placeholder={trans('components.container.container_form.article:placeholder')}
      clearLabel={trans('components.container.container_form.article:clear')}
      value={value}
      options={articles}
      renderOption={option => option.designation}
      onPressOption={onChangedValue}
      optional={!required}
    />
  );
}

/**
 * @param {Fluid|null} fluid
 * @param {Competitor|null} competitor
 * @param {Installation|null} installation
 * @param {InstallationType|null} interventionType
 * @param {Purpose|null} purpose
 *
 * @return {Article[]}
 */
export function filteredArticles({ fluid, competitor, installation, interventionType, purpose }) {
  const articleRepository = get('article_repository');
  const unavailabilityRepository = get('unavailability_repository');

  let articles;

  switch (true) {
    case !interventionType:
      // Case where we don't have an intervention type (e.g: from container info screen),
      // we need to show all articles matching the fluid for the competitor
      // + the articles without fluid but allowed for recup/transfer
      // See https://trello.com/c/PFMbRkAP/252-app-gestion-des-contenants-liste-des-articles
      articles = Array.from(articleRepository.findByFluidOrEmptyAndCompetitor(fluid, competitor)).filter(article => {
        // Article with matching fluid is fine:
        if (article.fluid) {
          return true;
        }

        // Exclude articles unavailable for both recup and transfer (Purpose.FILLING):
        return unavailabilityRepository.isAvailableForRecupOrTransfer(article.uuid);
      });
      break;

    case InterventionType.DRAINAGE === interventionType:
      // If current intervention is drainage, only suggest articles without fluid for the competitor:
      articles = Array.from(articleRepository.findByFluidAndCompetitor(null, competitor));
      break;

    case InterventionType.FILLING === interventionType:
    default:
      if (purpose === Purpose.FILLING_AFTER_TRANSFER) {
        // Special handling for filling intervention with "Suite transfert" (FILLING_AFTER_TRANSFER) purpose:
        // we need both articles with matching fluid or null
        articles = Array.from(articleRepository.findByFluidOrEmptyAndCompetitor(fluid, competitor)).filter(
          article => unavailabilityRepository.getUnavailability(article.uuid, Purpose.FILLING_AFTER_TRANSFER) === null,
        );
        break;
      }
      // In other cases, matches fluid and competitor:
      articles = Array.from(articleRepository.findByFluidAndCompetitor(fluid, competitor));
      break;
  }

  const minPressure = installation?.primaryCircuit?.pressure;

  if (minPressure) {
    articles = articles.filter(
      article => article.pressure === null || Pressure.compare(article.pressure, minPressure) >= 0,
    );
  }

  if (fluid === null) {
    // If no fluid is selected, do not suggest articles with empty volume (0 or null)
    articles = articles.filter(article => article.volume !== 0 && article.volume !== null);
  }

  // Filters out article without any intervention availability (used only for traceability):
  articles = articles.filter(article => !unavailabilityRepository.isNotAvailableForInterventions(article.uuid));

  return articles.sort(
    (a, b) =>
      alphabetically(a.designation, b.designation) ||
      alphabetically(a.fluid ? a.fluid.designation : '', b.fluid ? b.fluid.designation : '') ||
      numerically(a.quantity, b.quantity) ||
      numerically(a.volume, b.volume),
  );
}
