import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import I18n from 'i18n-js';
import Text from 'k2/app/modules/common/components/Text';
import Icon from 'k2/app/modules/common/components/Icon';
import ModalView from '../modal/ModalView';
import FormAbstract from './FormAbstract';
import MainListView from '../list/MainListView';
import { Button } from '.';
import { COLOR_UNDERLAY } from 'k2/app/modules/common/styles/vars';

class Select extends FormAbstract {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])).isRequired,
    renderOption: PropTypes.func.isRequired,
    onPressOption: PropTypes.func.isRequired,
    title: PropTypes.string,
    placeholder: PropTypes.string,
    clearLabel: PropTypes.string,
    /**
     * Hide the input if there is no option available
     */
    hideOnNoOptions: PropTypes.bool,
    disabled: PropTypes.bool,
    optional: PropTypes.bool,
    labelStyle: PropTypes.shape(),
  };

  static defaultProps = {
    title: null, // Will use a default value
    placeholder: null, // Will use a default value
    clearLabel: null, // Will use a default value
    hideOnNoOptions: true,
    disabled: false,
    optional: false,
    labelStyle: {},
  };

  static styles = {
    ...FormAbstract.styles,
    contentButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    icon: {
      alignSelf: 'center',
      flex: 0,
      color: COLOR_UNDERLAY,
    },
    noValue: {
      ...FormAbstract.styles.input,
      ...FormAbstract.styles.text,
      fontStyle: 'italic',
    },
    disabled: {
      backgroundColor: '#f5f5f5',
    },
  };

  constructor() {
    super();

    this.state = {
      displayModal: false,
    };

    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onPressItem = this.onPressItem.bind(this);
    this.onReset = this.onReset.bind(this);
  }

  /**
   * Show modal
   */
  showModal() {
    this.setState({ displayModal: true });
  }

  /**
   * Hide modal
   */
  hideModal() {
    this.setState({ displayModal: false });
  }

  /**
   * @param {Object} option
   */
  onPressItem(option) {
    this.props.onPressOption(option);
    this.hideModal();
  }

  /**
   * On reset button
   */
  onReset() {
    this.onPressItem(null);
  }

  renderComponent({ placeholder, value, disabled, renderOption, inputStyle, textStyle }) {
    const { styles } = Select;

    return (
      <TouchableOpacity style={[styles.input, inputStyle]} onPress={this.showModal} disabled={disabled}>
        <View style={styles.contentButton}>
          <Text
            ellipsizeMode="tail"
            numberOfLines={1}
            style={{
              ...styles.text,
              ...(value ? {} : styles.placeholder),
              ...textStyle,
            }}>
            {value !== null ? renderOption(value) : placeholder}
          </Text>
          {!disabled && <Icon style={styles.icon} name="chevron-down" />}
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * {@inheritdoc}
   */
  renderModal() {
    const { title, options, optional, clearLabel } = this.props;
    const { displayModal } = this.state;

    return (
      <ModalView key="modal" visible={displayModal} onCloseModal={this.hideModal} title={title} full>
        <MainListView
          data={options}
          onPressItem={this.onPressItem}
          renderContent={this.props.renderOption}
          icon={null}
        />
        {optional && <Button onPress={this.onReset}>{clearLabel || I18n.t('common.reset')}</Button>}
      </ModalView>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    if (this.props.hideOnNoOptions && this.props.options.length === 0) {
      return null;
    }

    return super.render();
  }
}

export default Select;
