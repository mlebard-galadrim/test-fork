import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { get, useService } from 'k2/app/container';
import Select from 'k2/app/modules/common/components/form/Select';
import { trans } from 'k2/app/I18n';
import Competitor from 'k2/app/modules/nomenclature/models/Competitor';

SelectCompetitor.propTypes = {
  value: PropTypes.instanceOf(Competitor),
  onChangedValue: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  /**
   * Allows empty competitor to be selected (means Climalife).
   * This option usually is only allowed for creating a container
   * if there is no existing Climalife known or unknown container for the searched barcode.
   */
  allowEmpty: PropTypes.bool,
  filter: PropTypes.func,
};

SelectCompetitor.defaultProps = {
  value: null,
  disabled: false,
  allowEmpty: true,
  filter: () => true,
};

export default function SelectCompetitor({ disabled, value, onChangedValue, allowEmpty, filter, ...remainingProps }) {
  // Init competitors on mount:
  const competitors = useMemo(() => {
    const competitors = Array.from(get('competitor_repository').findAll()).filter(filter);
    if (!allowEmpty) {
      return competitors;
    }
    // (null means Climalife)
    return [null].concat(competitors);
  }, [allowEmpty, filter]);
  const climalifePlaceholder = trans('components.container.container_form.competitor:placeholder');

  return (
    <Select
      title={trans('components.container.container_form.competitor:label')}
      placeholder={
        allowEmpty ? climalifePlaceholder : trans('components.container.container_form.competitor:placeholder:required')
      }
      options={competitors}
      value={value}
      onPressOption={onChangedValue}
      renderOption={option => (option ? option.designation : climalifePlaceholder)}
      disabled={disabled}
      {...remainingProps}
    />
  );
}

SelectCompetitorForBarcode.propTypes = {
  ...SelectCompetitor.propTypes,
  barcode: PropTypes.string.isRequired,
};

SelectCompetitorForBarcode.defaultProps = SelectCompetitor.defaultProps;

export function SelectCompetitorForBarcode({ barcode, ...remainingProps }) {
  const containerRepository = useService('container_repository');
  /**
   * Fetches competitor from containers with the given barcode.
   */
  const existingContainersCompetitorsUids = useMemo(
    () =>
      containerRepository.search(barcode).reduce((uids, container) => {
        if (container.competitor && !uids.includes(container.competitor.uuid)) {
          uids.push(container.competitor.uuid);
        }

        return uids;
      }, []),
    [barcode, containerRepository],
  );

  /**
   * Exclude competitors that already have a container for the searched barcode.
   */
  const filter = useCallback(
    competitor => !existingContainersCompetitorsUids.includes(competitor.uuid),
    [existingContainersCompetitorsUids],
  );

  return <SelectCompetitor {...remainingProps} filter={filter} hideOnNoOptions={false} />;
}
