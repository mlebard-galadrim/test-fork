import React from 'react';
import PropTypes from 'prop-types';
import Fluid from 'k2/app/modules/nomenclature/models/Fluid';
import { useMemo } from 'react';
import { get } from 'k2/app/container';
import Select from 'k2/app/modules/common/components/form/Select';
import { trans } from 'k2/app/I18n';

SelectFluid.propTypes = {
  value: PropTypes.instanceOf(Fluid),
  onChangedValue: PropTypes.func.isRequired,
  required: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

SelectFluid.defaultProps = {
  value: null,
  disabled: false,
};

export default function SelectFluid({ value, onChangedValue, required, disabled }) {
  // Init fluids on mount:
  const fluids = useMemo(() => Array.from(get('fluid_repository').findAll()), []);

  return (
    <Select
      title={trans('components.container.container_form.fluid:label')}
      placeholder={trans('components.container.container_form.fluid:placeholder')}
      options={fluids}
      value={value}
      onPressOption={onChangedValue}
      renderOption={option => option.designation}
      optional={!required}
      disabled={disabled}
    />
  );
}
