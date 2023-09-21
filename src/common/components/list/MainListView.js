import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { TouchableOpacity, SectionList, Text, View } from 'react-native';
import { throttle } from 'k2/app/modules/common/utils/NavigationUtils';
import { GUTTER, COLOR_LIGHT_BG } from 'k2/app/modules/common/styles/vars';
import { alphabetically } from 'k2/app/modules/common/utils/filterUtils';

class MainListView extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape(), PropTypes.string])).isRequired,
    renderContent: PropTypes.func.isRequired,
    getSectionId: PropTypes.func,
    onPressItem: PropTypes.func,
    isDisabled: PropTypes.func,
    keyExtractor: PropTypes.func,
    icon: PropTypes.string,
    style: PropTypes.shape(),
    getRowStyles: PropTypes.func,
    rowStyle: PropTypes.shape(),
    noDataContent: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    sorter: PropTypes.func,
  };

  static defaultProps = {
    icon: 'chevron-right',
    getSectionId: null,
    onPressItem: null,
    isDisabled: null,
    keyExtractor: null,
    sorter: null,
    style: {},
    getRowStyles: () => {},
    noDataContent: 'common.empty_list',
  };

  static styles = {
    firstRow: {
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    row: {
      borderWidth: 0,
      borderStyle: 'solid',
      // Android does not support well overriding borderColor with single side rules:
      // https://github.com/facebook/react-native/issues/19981
      // Let's always be specific:
      borderBottomColor: '#eee',
      borderBottomWidth: 1,
      borderLeftWidth: 0,

      padding: GUTTER,
    },
    noDataText: {
      flex: 1,
      textAlign: 'center',
      fontStyle: 'italic',
      padding: GUTTER,
    },
    disabled: {
      backgroundColor: COLOR_LIGHT_BG,
    },
    divider: {
      paddingHorizontal: 10,
      paddingVertical: 2,
      backgroundColor: '#eeeeee',
    },
  };

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.renderNoDataContent = this.renderNoDataContent.bind(this);
    this.getSections = this.getSections.bind(this);
    this.sortedData = this.sortedData.bind(this);
    this.getKey = this.getKey.bind(this);
  }

  /**
   * Get section ID
   *
   * @param {String} value
   *
   * @return {String}
   */
  getSectionId(value) {
    return this.props.getSectionId(value).toString().toUpperCase();
  }

  /**
   * Key extractor for list items
   *
   * @param  {Object|null} item
   * @param  {Number} index
   *
   * @return {String}
   */
  getKey(item, index) {
    if (item === null) {
      return 'placeholder';
    }

    if (typeof item.key !== 'undefined') {
      return item.key;
    }

    if (typeof item.uuid !== 'undefined') {
      return item.uuid;
    }

    if (typeof item.id !== 'undefined') {
      return item.id;
    }

    return String(index);
  }

  /**
   * Renders a row
   *
   * @param {Object} item Item of this row
   *
   * @return {Component}
   */
  renderRow({ item, index }) {
    const { styles } = this.constructor;
    const { onPressItem, isDisabled, getRowStyles } = this.props;
    const disabled = isDisabled ? isDisabled(item) : false;

    const row = (
      <View
        style={{
          ...styles.row,
          ...(parseInt(index, 10) === 0 ? styles.firstRow : {}),
          ...getRowStyles(item, index),
          ...(disabled ? styles.disabled : {}),
        }}
      >
        {this.renderRowContent(item)}
        {this.renderRowRightIcon(item)}
      </View>
    );

    if (!onPressItem || disabled) {
      return row;
    }

    return <TouchableOpacity onPress={throttle(() => onPressItem(item))}>{row}</TouchableOpacity>;
  }

  /**
   * Render the content to display inside a row
   *
   * @param {Object} item Item of this row
   */
  renderRowContent(item, index) {
    const content = this.props.renderContent(item);

    if (typeof content === 'string') {
      return (
        <Text key={index} ellipsizeMode="tail" numberOfLines={1}>
          {content}
        </Text>
      );
    }

    return content;
  }

  /**
   * Render the icon to display on the right end of a row
   *
   * @param {Object} item Item of this row
   *
   * @return {Component}
   */
  renderRowRightIcon(item) {
    const { icon, onPressItem } = this.props;
    const disabled = !!item && item.disabled;

    if (!onPressItem || disabled || !icon) {
      return null;
    }

    // return <Icon styleName="disclosure" name={icon} />;
    return null;
  }

  /**
   * Render a section header
   *
   * @return {Component}
   */
  renderSectionHeader({ section: { title } }) {
    const { styles } = this.constructor;

    return (
      <View key={`header_${title}`} styleName="line" style={styles.divider}>
        <Text ellipsizeMode="tail" numberOfLines={1}>
          {title}
        </Text>
      </View>
    );
  }

  renderNoDataContent() {
    const { noDataContent, style } = this.props;
    const { styles } = this.constructor;

    if (typeof noDataContent === 'string') {
      return <Text style={{ ...style, ...styles.noDataText }}>{I18n.t(noDataContent)}</Text>;
    }

    return noDataContent;
  }

  /**
   * @inheritdoc
   */
  render() {
    const { data, getSectionId, keyExtractor, style } = this.props;

    if (data.length === 0) {
      return this.renderNoDataContent();
    }

    return (
      <SectionList
        sections={this.getSections()}
        renderItem={this.renderRow}
        renderSectionHeader={getSectionId ? this.renderSectionHeader : undefined}
        keyExtractor={keyExtractor ? keyExtractor : this.getKey}
        style={style}
      />
    );
  }

  sortedData() {
    const { data, sorter } = this.props;

    return !sorter ? data : data.sort(sorter);
  }

  getSections() {
    const { getSectionId } = this.props;
    const sortedData = this.sortedData();

    if (!getSectionId) {
      return [{ data: sortedData }];
    }

    const itemsById = [];
    sortedData.forEach(item => {
      const id = this.getSectionId(item);
      itemsById[id] = (itemsById[id] || []).concat(item);
    });

    return Object.entries(itemsById)
      .map(([title, data]) => ({ title, data }))
      .sort((a, b) => alphabetically(a.title, b.title));
  }
}

export default MainListView;
