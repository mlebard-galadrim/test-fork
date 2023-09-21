import React, { Component } from 'react';
import I18n from 'i18n-js';
import { TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import MainListView from 'k2/app/modules/common/components/list/MainListView';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLOR_LIGHT_BG, COLOR_PRIMARY } from 'k2/app/modules/common/styles/vars';
import View from 'k2/app/modules/common/components/View';
import Text from 'k2/app/modules/common/components/Text';
import { padding } from 'k2/app/modules/common/styles/utils';

export default class SelectMultipleList extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])).isRequired,
    renderOption: PropTypes.func.isRequired,
    onChangedSelection: PropTypes.func,
    selectedOptions: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])),
    compareItems: PropTypes.func,
  };

  static defaultProps = {
    onChangedSelection: null,
    selectedOptions: [],
    compareItems: (a, b) => a === b,
  };

  static styles = {
    wrapper: {
      flexDirection: 'column',
      flex: 1,
    },
    toggleSelection: {
      flex: 0,
      alignItems: 'flex-end',
    },
    toggleSelectionText: {
      ...padding(10, 5),
      color: COLOR_PRIMARY,
    },
    list: {
      flex: 1,
    },
    row: {
      flex: 1,
      alignItems: 'center',
      flexDirection: 'row',
    },
    iconWrapper: {
      margin: 0,
      marginRight: 10,
    },
    icon: {
      padding: 0,
      color: COLOR_LIGHT_BG,
    },
    iconChecked: {
      color: COLOR_PRIMARY,
    },
    content: {
      flex: 1,
    },
  };

  constructor(props) {
    super(props);

    this.onPressOption = this.onPressOption.bind(this);
    this.renderSelectableOption = this.renderSelectableOption.bind(this);
    this.isSelected = this.isSelected.bind(this);
    this.toggleSelection = this.toggleSelection.bind(this);
    this.areAllOptionsSelected = this.areAllOptionsSelected.bind(this);

    this.state = {
      selectedItems: props.selectedOptions,
    };
  }

  onPressOption(option) {
    const { selectedItems } = this.state;
    const { onChangedSelection, compareItems } = this.props;

    let newSelectedItems = selectedItems;
    if (this.isSelected(option)) {
      // Remove from selection
      newSelectedItems = selectedItems.filter(item => !compareItems(item, option));
    } else {
      // Add to selection
      newSelectedItems = [...selectedItems, option];
    }

    this.setState(
      { selectedItems: newSelectedItems },
      onChangedSelection ? () => onChangedSelection(newSelectedItems) : null,
    );
  }

  renderSelectableOption(option, index) {
    const { renderOption } = this.props;
    const { styles } = this.constructor;
    const selected = this.isSelected(option);

    return (
      <View style={styles.row}>
        <View style={styles.iconWrapper}>
          <Icon
            size={20}
            name={selected ? 'check-circle' : 'circle'}
            style={{ ...styles.icon, ...(selected ? styles.iconChecked : {}) }}
          />
        </View>
        <View style={styles.content}>{renderOption(option, index, selected)}</View>
      </View>
    );
  }

  isSelected(option) {
    return this.state.selectedItems.find(selectedItem => this.props.compareItems(selectedItem, option)) || false;
  }

  toggleSelection() {
    const { options, onChangedSelection } = this.props;

    let selectedItems = [];
    if (this.areAllOptionsSelected()) {
      // if all items are already selected, unselect all:
      selectedItems = [];
    } else {
      // else, select all:
      selectedItems = options;
    }

    this.setState({ selectedItems }, onChangedSelection ? () => onChangedSelection(selectedItems) : null);
  }

  areAllOptionsSelected() {
    const { selectedItems } = this.state;
    const { options } = this.props;

    return selectedItems.length === options.length;
  }

  render() {
    const { styles } = this.constructor;
    const { options, ...props } = this.props;
    delete props.onChangedSelection;
    delete props.renderOption;
    delete props.selectedOptions;

    return (
      <View style={styles.wrapper}>
        {options.length > 0 && (
          <TouchableOpacity onPress={this.toggleSelection} style={styles.toggleSelection}>
            <Text style={styles.toggleSelectionText}>
              {I18n.t(
                this.areAllOptionsSelected()
                  ? 'common.form.select_multiple_list.unselect_all'
                  : 'common.form.select_multiple_list.select_all',
              )}
            </Text>
          </TouchableOpacity>
        )}
        <MainListView
          style={styles.list}
          data={options}
          renderContent={this.renderSelectableOption}
          onPressItem={this.onPressOption}
          {...props}
        />
      </View>
    );
  }
}
