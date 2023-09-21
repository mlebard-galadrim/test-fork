import React from 'react';
import { TouchableOpacity, SectionList, View } from 'react-native';
import MainListView from './MainListView';
import Text from 'k2/app/modules/common/components/Text';
import { margin } from '../../styles/utils';
import { throttle } from '../../utils/NavigationUtils';
import { COLOR_PRIMARY, COLOR_UNDERLAY } from '../../styles/vars';

class AlphabeticList extends MainListView {
  static styles = {
    ...MainListView.styles,
    layout: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    letters: {
      flex: 0,
      overflow: 'hidden',
      flexDirection: 'column',
      alignItems: 'center',
    },
    letter: {
      flex: 1,
      fontSize: 12,
      color: COLOR_UNDERLAY,
      ...margin(0, 5),
    },
    letterActive: {
      color: COLOR_PRIMARY,
    },
    list: {
      alignSelf: 'stretch',
    },
    divider: {
      paddingHorizontal: 10,
      paddingVertical: 2,
      backgroundColor: '#eeeeee',
    },
    dividerTitle: {
      color: '#333',
      fontWeight: 'bold',
    },
  };

  constructor(props) {
    super(props);

    this.letters = Array.from(new Array(26), (x, i) => String.fromCharCode(i + 65));
    this.state = {
      data: this.groupByLetter(props.data),
    };

    this.listView = null;
    this.listHeight = null;
    this.containerHeight = null;
    this.alphabetHeight = null;
    this.dividerHeight = null;
    this.rowHeight = null;

    this.onPressLetter = this.onPressLetter.bind(this);
    this.onAlphabetScroll = this.onAlphabetScroll.bind(this);
    this.renderLetter = this.renderLetter.bind(this);
    this.getItemLayout = this.getItemLayout.bind(this);
  }

  /**
   * @param {String}   letter
   */
  onPressLetter(letter) {
    this.scrollTo(letter);
  }

  /**
   * When user scrolls on the alphabet
   *
   * @param {Event} event
   */
  onAlphabetScroll(event) {
    const { locationY } = event.nativeEvent;
    const { letters } = this;
    const ratio = locationY / this.alphabetHeight;
    const index = Math.min(Math.max(Math.floor(ratio * letters.length), 0), letters.length - 1);

    this.scrollTo(letters[index], false);
  }

  getItemLayout(data, index) {
    const itemHeight = this.rowHeight;

    return {
      length: itemHeight,
      offset: itemHeight * index,
      index,
    };
  }

  /**
   * Get section ID
   *
   * @param {Object} value
   *
   * @return {String}
   */
  getSectionId(value) {
    return super.getSectionId(value).charAt(0);
  }

  /**
   * Get layout height setter callback
   *
   * @param {String} property
   *
   * @return {Function}
   */
  getLayoutCallback(property) {
    if (this[property]) {
      return undefined;
    }

    return event => {
      this[property] = event.nativeEvent.layout.height;
    };
  }

  /**
   * Scroll to the given letter in list
   *
   * @param {String} letter
   * @param {Boolean} animated
   */
  scrollTo(letter, animated = true) {
    const { data } = this.state;

    if (!(letter in data)) {
      return;
    }

    const sectionIndex = Object.keys(data).indexOf(letter);

    this.listView.scrollToLocation({ sectionIndex, animated, itemIndex: 0 });
  }

  /**
   * {@inheritdoc}
   */
  renderSectionHeader({ section: { title } }) {
    const { styles } = this.constructor;

    return (
      <View style={styles.divider}>
        <Text style={styles.dividerTitle}>{title}</Text>
      </View>
    );
  }

  /**
   * {@inhertidoc}
   */
  renderRow({ item, index }) {
    const { styles } = this.constructor;
    const { onPressItem } = this.props;
    const rowStyle = {
      ...styles.row,
      ...(parseInt(index, 10) === 0 ? styles.firstRow : {}),
    };

    return (
      <TouchableOpacity
        key={item.id || item.key || index}
        onPress={throttle(() => onPressItem(item))}
        onLayout={this.getLayoutCallback('rowHeight')}
      >
        <View style={rowStyle}>
          {this.renderRowContent(item)}
          {this.renderRowRightIcon(item)}
        </View>
      </TouchableOpacity>
    );
  }

  /**
   * Render a single letter
   *
   * @param {Object} letter
   *
   * @return {String}
   */
  renderLetter(letter) {
    const { styles } = this.constructor;
    const isActive = letter in this.state.data;
    const style = {
      ...styles.letter,
      ...(isActive ? styles.letterActive : {}),
    };

    return (
      <Text style={style} key={`letter_${letter.toString()}`} onPress={() => this.onPressLetter(letter)}>
        {letter}
      </Text>
    );
  }

  groupByLetter(data) {
    const groups = {};

    data
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach(item => {
        const letter = item.name[0].toUpperCase();

        if (typeof groups[letter] === 'undefined') {
          groups[letter] = {
            title: letter.toUpperCase(),
            data: [],
          };
        }

        groups[letter].data.push(item);
      });

    return groups;
  }

  renderList() {
    const { data } = this.state;

    if (data.length === 0) {
      return this.renderNoDataContent();
    }

    return (
      <SectionList
        ref={listView => {
          this.listView = listView;
        }}
        getItemLayout={this.getItemLayout}
        sections={Object.values(data)}
        renderItem={this.renderRow}
        renderSectionHeader={this.renderSectionHeader}
      />
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;

    return (
      <View style={styles.layout}>
        {this.renderList()}
        <View
          style={styles.letters}
          onStartShouldSetResponder={() => true}
          onMoveShouldSetResponder={() => true}
          onResponderMove={this.onAlphabetScroll}
          onLayout={this.getLayoutCallback('alphabetHeight')}
        >
          {this.letters.map(this.renderLetter)}
        </View>
      </View>
    );
  }
}

export default AlphabeticList;
