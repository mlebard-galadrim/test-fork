import View from 'k2/app/modules/common/components/View';
import RNDatePicker from 'react-native-datepicker';
import moment from 'moment/moment';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import { trans } from 'k2/app/I18n';
import React from 'react';
import Text from 'k2/app/modules/common/components/Text';
import { padding } from 'k2/app/modules/common/styles/utils';
import { COLOR_PLACEHOLDER } from 'k2/app/modules/common/styles/vars';

DatePicker.propTypes = {
  // From RN DatePicker
  mode: RNDatePicker.propTypes.mode,
  placeholder: RNDatePicker.propTypes.placeholder,
  // Custom
  label: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  format: PropTypes.string,
  allowClear: PropTypes.bool,
  style: PropTypes.shape(),
  labelStyle: PropTypes.shape(),
  inputStyle: PropTypes.shape(),
  inputContainerStyle: PropTypes.shape(),
};

DatePicker.defaultProps = {
  // From RN DatePicker
  mode: RNDatePicker.defaultProps.mode,
  placeholder: RNDatePicker.defaultProps.placeholder,
  // Custom
  format: 'date.formats.moment_datepicker',
  allowClear: false,
  style: {},
  labelStyle: {},
  inputStyle: {},
  inputContainerStyle: {},
};

export default function DatePicker({
  mode,
  placeholder,
  date,
  label,
  onChange,
  format,
  allowClear,
  style,
  labelStyle,
  inputStyle,
  inputContainerStyle,
}) {
  const { styles, customStyles } = DatePicker;

  /**
   * @param {String} value
   */
  function onDateChange(value) {
    const date = moment(value, trans(format));

    onChange(new Date(date));
  }

  return (
    <View style={{ ...styles.container, ...style }}>
      {/* Label */}
      <Text style={{ ...styles.label, ...labelStyle }}>{label}</Text>

      {/* Input */}
      <View style={{ ...styles.inputContainerStyle, ...inputContainerStyle }}>
        <RNDatePicker
          style={{ ...styles.input, ...inputStyle }}
          customStyles={customStyles}
          mode={mode}
          date={date ? moment(date).format(trans(format)) : null}
          placeholder={placeholder ?? trans('common.not_provided')}
          confirmBtnText={trans('common.submit')}
          cancelBtnText={trans('common.cancel')}
          onDateChange={onDateChange}
          showIcon={false}
          format={trans(format)}
        />
        {allowClear && date !== null && (
          <TouchableOpacity onPress={() => onChange(null)} style={styles.clearBtn}>
            <Icon style={styles.clearIcon} size={15} name="times-circle" solid />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

DatePicker.styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
  },
  inputContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingRight: 10,
  },
  clearBtn: {
    flex: 0,
    ...padding(5, 5, 5, 15),
  },
});

const text = {
  flex: 1,
  fontSize: 13,
  ...padding(8, 0, 5),
};

/**
 * @see mobile/node_modules/react-native-datepicker/style.js
 */
DatePicker.customStyles = {
  /**
   * Custom style to fix the iOS 14 datepicker wheel
   *
   * @see https://github.com/xgfe/react-native-datepicker/issues/425#issuecomment-692004207
   */
  datePicker: {
    backgroundColor: '#d1d3d8',
    justifyContent: 'center',
  },
  dateTouchBody: {
    height: 30,
  },
  dateInput: {
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
    height: 30,
    borderWidth: 0,
  },
  dateText: {
    ...text,
    color: '#666',
  },
  placeholderText: {
    ...text,
    color: COLOR_PLACEHOLDER,
  },
};
