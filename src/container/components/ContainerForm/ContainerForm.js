import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Purpose from 'k2/app/modules/intervention/models/Purpose';
import InterventionType from 'k2/app/modules/intervention/models/InterventionType';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { FloatInput, Select, TextInput } from 'k2/app/modules/common/components/form';
import Pressure from 'k2/app/modules/nomenclature/models/Pressure';
import Usage from 'k2/app/modules/nomenclature/models/Usage';
import Fieldset from 'k2/app/modules/common/components/Fieldset';
import SelectArticle, { filteredArticles } from 'k2/app/modules/container/components/ContainerForm/SelectArticle';
import Installation from 'k2/app/modules/installation/models/Installation';
import { trans } from 'k2/app/I18n';
import SelectFluid from 'k2/app/modules/container/components/ContainerForm/SelectFluid';
import SelectCompetitor, {
  SelectCompetitorForBarcode,
} from 'k2/app/modules/container/components/ContainerForm/SelectCompetitor';
import Competitor from 'k2/app/modules/nomenclature/models/Competitor';
import Fluid from 'k2/app/modules/nomenclature/models/Fluid';
import Article from 'k2/app/modules/nomenclature/models/Article';

ContainerForm.propTypes = {
  title: PropTypes.string.isRequired,
  forBarcode: PropTypes.string,
  initialData: PropTypes.shape({
    barcode: PropTypes.string,
    competitor: PropTypes.instanceOf(Competitor),
    load: PropTypes.number,
    fluid: PropTypes.instanceOf(Fluid),
    article: PropTypes.instanceOf(Article),
  }),
  isKnownContainer: PropTypes.bool,
  interventionType: PropTypes.oneOf(InterventionType.values),
  interventionPurpose: PropTypes.oneOf(Purpose.values),
  installation: PropTypes.instanceOf(Installation),
  allowEmptyCompetitor: PropTypes.bool,
  children: PropTypes.func.isRequired,
};
ContainerForm.defaultProps = {
  initialData: null,
  forBarcode: null,
  /** Can only be set to true on update */
  isKnownContainer: false,
  interventionType: null,
  interventionPurpose: null,
  installation: null,
  allowEmptyCompetitor: true,
};

export default function ContainerForm({
  forBarcode,
  initialData,
  title,
  children,
  installation,
  interventionType,
  interventionPurpose,
  isKnownContainer,
  allowEmptyCompetitor,
}) {
  const isUpdate = Boolean(initialData?.barcode);
  const isDrainage = interventionType === InterventionType.DRAINAGE;
  const isFilling = interventionType === InterventionType.FILLING;

  const [barcode, setBarcode] = useState(forBarcode ?? initialData?.barcode ?? '');
  const [competitor, setCompetitor] = useState(initialData?.competitor ?? null);
  const [load, setLoad] = useState(initialData?.load ?? null);

  // initial fluid is computed once depending on the context:
  const [fluid, setFluid] = useState(() => {
    // Use initial fluid if modifying an existing container
    if (initialData?.fluid) {
      return initialData.fluid;
    }

    if (installation) {
      // Unless the intervention is a drainage, the fluid is the one from the installation:
      return isDrainage ? null : installation.primaryCircuit?.fluid;
    }
    // No installation available in contexte, cannot pre-determine the fluid:
    return null;
  });

  const [selectedArticle, setSelectedArticle] = useState(initialData?.article ?? null);
  // Do not display directly the new article fields,
  // but wait for the user to have explicitly pressed the "new article" option:
  const [hasPressedNewArticle, setHasPressedNewArticle] = useState(false);
  // Competitor and no existing article selected:
  const showNewArticleFields = hasPressedNewArticle && competitor !== null && selectedArticle === null;

  // New article:
  const [pressure, setPressure] = useState(null);
  const [capacity, setCapacity] = useState(null);
  const [volume, setVolume] = useState(null);
  const [usage, setUsage] = useState(null);
  const [designation, setDesignation] = useState('');

  /**
   *  Renders the capacity input for a new article:
   * - for filling usages (non-recup nor transfer)
   */
  const showCapacity = usage === Usage.FILLING;
  const defaultLoad = selectedArticle?.quantity ?? capacity ?? 0;

  // Reload Available articles on competitor or fluid changes:
  const articles = useMemo(
    () =>
      filteredArticles({
        fluid,
        competitor,
        installation,
        interventionType,
        purpose: interventionPurpose,
      }),
    [competitor, fluid, installation, interventionPurpose, interventionType],
  );

  /**
   * Ensures the currently selected article is in the list of available one,
   * or reset:
   */
  useEffect(() => {
    if (
      isUpdate &&
      selectedArticle?.uuid === initialData?.article?.uuid &&
      selectedArticle?.fluid?.uuid === fluid?.uuid
    ) {
      // noop if it's the initial article present in the container during an update,
      // but at least the selected fluid should match the article one (or both null).
      return;
    }

    if (selectedArticle && !articles.some(art => art.uuid === selectedArticle.uuid)) {
      // Reset article if it's not available in the new article choices.
      setSelectedArticle(null);
      setHasPressedNewArticle(false);
    }
  }, [selectedArticle, articles, fluid?.uuid, initialData?.article?.uuid, isUpdate]);

  /**
   * @return {Boolean}
   */
  function isFormValid() {
    // Barcode is required:
    if (barcode.length === 0) {
      return false;
    }

    // A fluid MUST be set during a filling intervention:
    if (isFilling && fluid === null) {
      return false;
    }

    // Ensures a competitor is selected if not allowed empty
    if (!allowEmptyCompetitor && competitor === null) {
      return false;
    }

    // A competitor container not referencing an existing article MUST have its usage filled
    if (competitor && !selectedArticle && !usage) {
      return false;
    }

    // A non-competitor container MUST use an existing article
    if (!competitor) {
      return Boolean(selectedArticle);
    }

    // Skip the next validation check if an existing article is selected:
    if (selectedArticle) {
      return true;
    }

    // Mandatory capacity for new filling article during filling intervention:
    if (isFilling && usage === Usage.FILLING && capacity === null) {
      return false;
    }

    // Volume MUST never be empty for a new article:
    // noinspection RedundantIfStatementJS
    if (!volume) {
      return false;
    }

    return true;
  }

  function getDataToSubmit() {
    return {
      barcode,
      competitor,
      load: load ?? defaultLoad,
      fluid,
      selectedArticle,
      // new article fields:
      capacity,
      volume,
      pressure,
      usage,
      designation: selectedArticle
        ? null // No designation to set on existing article:
        : // We append the bottle and size designation to the designation provided by the user:
        getComputedDesignation(),
    };
  }

  function getComputedDesignation() {
    return `${designation} ${getBottleDesignation()} ${getSizeDesignation()}`.trim();
  }

  /**
   * Get the size of the bottle for designation.
   * For recup/transfer, we use only the volume of the container.
   * For other containers, we use both volume and capacity if available.
   *
   * @see https://trello.com/c/Weqx66Kf/253-app-gestion-des-contenants-libell%C3%A9-article
   *
   * @return {String}
   */
  function getSizeDesignation() {
    const components = [];
    // Always use the volume of the container:
    if (volume !== null) {
      components.push(`${volume}L`);
    }
    // Only for non-recup nor transfer containers, add the capacity if available:
    if (capacity && Usage.FILLING === usage) {
      components.push(`${capacity}Kg`);
    }

    return components.join(' - ');
  }

  /**
   * Get the name of the bottle for designation
   *
   * @return {String}
   */
  function getBottleDesignation() {
    // Rely on usage if available:
    switch (usage) {
      case Usage.DRAINAGE:
        return trans(`article.default_designation.${Purpose.readableFor(Purpose.RECUPERATION)}`);

      case Usage.TRANSFER:
        return trans(`article.default_designation.${Purpose.readableFor(Purpose.TRANSFER)}`);

      case Usage.FILLING:
        // Non-recup nor transfer uses the fluid designation if a fluid is set:
        if (fluid) {
          return fluid.designation;
        }

        return trans('article.default_designation.unknown');

      default:
      //noop on no usage, continue below:
    }

    // Otherwise, check the intervention purpose:
    if (isDrainage) {
      return trans(`article.default_designation.${Purpose.readableFor(interventionPurpose)}`);
    }

    if (isFilling && fluid) {
      return fluid.designation;
    }

    return trans('article.default_designation.unknown');
  }

  return (
    <WrapperView scrollable keyboardAware full title={title}>
      <TextInput
        title={trans('components.container.container_form.barcode:label')}
        placeholder={trans('components.container.container_form.barcode:placeholder')}
        onChangeText={option => {
          setBarcode(option);
          // Reset competitor on barcode change, since the list of available ones will change:
          setCompetitor(null);
          setHasPressedNewArticle(false);
        }}
        defaultValue={barcode}
        editable={!isUpdate}
      />
      {isUpdate ? (
        // On update, we just display the disabled field with it current value:
        <SelectCompetitor
          value={competitor}
          onChangedValue={setCompetitor}
          allowEmpty={allowEmptyCompetitor}
          disabled
        />
      ) : (
        // On create, we allow to select the competitor,
        // but we exclude the already existing options for the barcode;
        <SelectCompetitorForBarcode
          barcode={barcode}
          value={competitor}
          onChangedValue={setCompetitor}
          allowEmpty={allowEmptyCompetitor}
        />
      )}
      <FloatInput
        title={trans('components.container.container_form.load:label')}
        placeholder={defaultLoad.toString()}
        onChangeText={option => setLoad(option ? FloatInput.parse(option) : null)}
        defaultValue={load}
        unit={trans('common.unit.kg')}
        optional={!isUpdate}
      />

      {/* Container content (Fluid & Article) */}
      <SelectFluid
        value={fluid}
        onChangedValue={option => {
          setFluid(option);
          if (!option) {
            // Reset capacity if no fluid is selected.
            setCapacity(null);
          }

          // If the fluid changed:
          if (option?.uuid !== fluid?.uuid) {
            // Force the user to re-explicitly select the "new article" option:
            setHasPressedNewArticle(false);
          }
        }}
        // Cannot change for a known container:
        disabled={isKnownContainer}
        required={isFilling}
      />

      <SelectArticle
        articles={articles}
        value={selectedArticle}
        onChangedValue={article => {
          // The user explicitly selected the "create new article" option,
          // we'll show the new article fields:
          if (article === null) {
            setSelectedArticle(null);
            setHasPressedNewArticle(true);
            return;
          }

          // Setting an article should reflect its fluid in the form if it exists for given article:
          setSelectedArticle(article);
          setFluid(article?.fluid ?? fluid);
        }}
        // Required for Climalife containers
        required={competitor === null}
        // Cannot change for a known container:
        disabled={isKnownContainer}
      />

      {/* Whenever a competitor is set but no article is selected, allow to create a new article: */}
      {showNewArticleFields && (
        <Fieldset title={trans('components.container.container_form.fieldset.new_article')}>
          <FloatInput
            title={trans('components.container.container_form.volume:label')}
            placeholder={trans('components.container.container_form.volume:placeholder')}
            onChangeText={option => setVolume(FloatInput.parse(option))}
            defaultValue={volume}
            unit={trans('common.unit.L')}
          />

          {showCapacity && (
            <FloatInput
              title={trans('components.container.container_form.capacity:label')}
              placeholder={trans('components.container.container_form.capacity:placeholder')}
              onChangeText={option => setCapacity(FloatInput.parse(option))}
              defaultValue={capacity}
              unit={trans('common.unit.kg')}
              // Required for filling intervention:
              optional={!isFilling}
            />
          )}

          <SelectPressure
            pressure={pressure}
            setPressure={setPressure}
            minPressure={installation?.primaryCircuit?.pressure ?? null}
          />

          <Select
            title={trans('components.container.container_form.usage:label')}
            placeholder={trans('components.container.container_form.usage:label')}
            value={usage}
            options={Usage.values}
            renderOption={option => (option ? trans(Usage.readableFor(option)) : null)}
            onPressOption={selectedUsage => {
              setUsage(selectedUsage);
              if (selectedUsage !== Usage.FILLING) {
                // Reset capacity if usage is not filling:
                setCapacity(null);
              }
            }}
          />

          <TextInput
            title={trans('components.container.container_form.designation:label')}
            onChangeText={option => setDesignation(option.toUpperCase())}
            defaultValue={designation}
            placeholder={getComputedDesignation()}
            optional
          />
        </Fieldset>
      )}

      {children({
        isValid: isFormValid(),
        data: getDataToSubmit(),
      })}
    </WrapperView>
  );
}

SelectPressure.propTypes = {
  pressure: PropTypes.oneOf(Pressure.values),
  setPressure: PropTypes.func.isRequired,
  minPressure: PropTypes.oneOf(Pressure.values),
};

SelectPressure.defaultProps = {
  pressure: null,
  minPressure: null,
};

function SelectPressure({ pressure, setPressure, minPressure }) {
  let pressures = Pressure.values;

  if (minPressure !== null) {
    pressures = pressures.filter(value => Pressure.compare(value, minPressure) >= 0);
  }

  return (
    <Select
      title={trans('components.container.container_form.pressure:label')}
      placeholder={trans('components.container.container_form.pressure:label')}
      value={pressure}
      options={pressures}
      renderOption={option => (option ? trans(Pressure.readableFor(option)) : null)}
      onPressOption={setPressure}
      optional
    />
  );
}
