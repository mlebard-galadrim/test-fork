import React from 'react';
import moment from 'moment';
import I18n from 'i18n-js';
import { TextInput } from 'k2/app/modules/common/components/form';

/**
 * An informational non-editable field in the same style as a TextInput field.
 * Auto format dates with default format.
 */
export default function (props) {
  let { value, ...remainingProps } = props;

  if (value instanceof Date) {
    value = moment(value).format(I18n.t('date.formats.moment_datepicker'));
  }

  return <TextInput {...remainingProps} value={value} editable={false} />;
}
