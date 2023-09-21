import I18n from 'i18n-js';
import React from 'react';
import PropTypes from 'prop-types';
import RNDatePicker from 'react-native-datepicker';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import FormAbstract from './FormAbstract';
import { COLOR_PLACEHOLDER } from 'k2/app/modules/common/styles/vars';
import View from 'k2/app/modules/common/components/View';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { padding } from 'k2/app/modules/common/styles/utils';

class DatePicker extends FormAbstract {
  static propTypes = {
    date: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
    format: PropTypes.string,
    allowClear: PropTypes.bool,
    optional: PropTypes.bool,
    disabled: PropTypes.bool,
    RenderCustomAction: PropTypes.elementType,
  };

  static defaultProps = {
    format: 'date.formats.moment_datepicker',
    allowClear: false,
    optional: false,
    disabled: false,
    RenderCustomAction: null,
  };

  static styles = {
    ...FormAbstract.styles,
    /**
     * Custom style to fix the iOS 14 datepicker wheel
     *
     * @see https://github.com/xgfe/react-native-datepicker/issues/425#issuecomment-692004207
     */
    datePicker: {
      backgroundColor: '#d1d3d8',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    dateInput: {
      alignItems: 'flex-start',
      alignSelf: 'flex-start',
      justifyContent: 'flex-start',
      height: 30,
      borderWidth: 0,
    },
    dateTouchBody: {
      height: 30,
    },
    dateText: {
      ...FormAbstract.styles.text,
      color: '#666',
    },
    placeholderText: {
      ...FormAbstract.styles.text,
      color: COLOR_PLACEHOLDER,
    },
    clearIcon: { color: COLOR_PLACEHOLDER },
    clearBtn: { ...padding(5, 5, 5, 15) },
  };

  constructor(props) {
    super(props);

    this.onDateChange = this.onDateChange.bind(this);
  }

  /**
   * @param {String} value
   */
  onDateChange(value) {
    const { format, onChange } = this.props;
    const date = moment(value, I18n.t(format));

    onChange(new Date(date));
  }

  /**
   * {@inheritdoc}
   */
  renderComponent(props) {
    const { styles } = this.constructor;
    const { placeholder, date, format, mode, allowClear, RenderCustomAction, disabled } = props;

    return (
      <View style={styles.container}>
        <RNDatePicker
          mode={mode}
          date={date ? moment(date).format(I18n.t(format)) : null}
          onDateChange={this.onDateChange}
          placeholder={placeholder ?? I18n.t('common.not_provided')}
          confirmBtnText={I18n.t('common.submit')}
          cancelBtnText={I18n.t('common.cancel')}
          showIcon={false}
          customStyles={styles}
          style={styles.input}
          format={I18n.t(format)}
          disabled={disabled}
        />
        {allowClear && date !== null && (
          <TouchableOpacity onPress={() => props.onChange(null)} style={styles.clearBtn}>
            <Icon style={styles.clearIcon} size={15} name="times-circle" solid />
          </TouchableOpacity>
        )}
        {RenderCustomAction ? <RenderCustomAction /> : null}
      </View>
    );
  }
}

export default DatePicker;
