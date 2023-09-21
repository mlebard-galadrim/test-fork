import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import { withNavigationFocus } from 'react-navigation';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import { Alert as RNAlert, FlatList, TouchableOpacity, Vibration } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import View from 'k2/app/modules/common/components/View';
import Icon from 'k2/app/modules/common/components/Icon';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import Scan from 'k2/app/modules/common/components/Scan';
import { Button } from 'k2/app/modules/common/components/form';
import { COLOR_INFO, COLOR_PRIMARY, COLOR_SECONDARY, GUTTER } from 'k2/app/modules/common/styles/vars';
import { margin, padding } from 'k2/app/modules/common/styles/utils';
import Container from 'k2/app/modules/container/models/Container';
import { PIPE_CONTAINER_INFOS, PIPE_SEARCH_CONTAINER, PIPE_SELECT_CONTAINER } from 'k2/app/modules/container/constants';
import {
  addShippingContainer,
  cancelContainersToShip,
  confirmContainersToShip,
  removeShippingContainer,
} from 'k2/app/modules/shipping/actions/shippingPipe';

/**
 * Batch Scan screen specific to Ariane operations
 *
 * @member {ArticleRepository} articleRepository
 */
class BatchScanArianeOperationContainers extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    arianeOperationLineNumbers: PropTypes.object.isRequired,
    arianeOperation: PropTypes.shape({
      number: PropTypes.number.isRequired,
      lines: PropTypes.arrayOf(
        PropTypes.shape({
          lineNumber: PropTypes.number.isRequired,
          articleExternalId: PropTypes.string.isRequired,
          quantity: PropTypes.number.isRequired,
        }).isRequired,
      ),
    }).isRequired,
    addShippingContainer: PropTypes.func.isRequired,
    removeShippingContainer: PropTypes.func.isRequired,
    confirmContainers: PropTypes.func.isRequired,
    cancelContainers: PropTypes.func.isRequired,
    isFocused: PropTypes.bool.isRequired,
    shippingContainers: PropTypes.arrayOf(PropTypes.instanceOf(Container)).isRequired,
  };

  static styles = {
    wrapper: {
      flexDirection: 'column',
    },
    scan: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    validate: {
      flex: 1,
      borderRadius: 0,
      paddingLeft: 64,
      height: 42,
    },
    manual: {
      flex: 0,
      borderRadius: 0,
      height: 42,
      width: 64,
    },
    manualText: {
      color: 'white',
      fontSize: 18,
      lineHeight: 18,
      textAlignVertical: 'bottom',
    },
    title: {
      flex: 0,
      textAlign: 'center',
      ...margin(GUTTER, 0),
      padding: GUTTER,
      color: 'white',
    },
    subtitle: {
      flex: 0,
      textAlign: 'center',
      padding: GUTTER,
      color: COLOR_INFO,
    },
    list: {
      flex: 0,
      flexBasis: 150,
    },
    listItem: {
      flex: 1,
      flexDirection: 'row',
      ...margin(GUTTER / 2, 10),
      alignItems: 'center',
    },
    lineDesignation: {
      flex: 1,
      padding: 0,
      color: 'white',
    },
    lineQuantity: {
      width: 45,
      color: 'white',
      backgroundColor: COLOR_SECONDARY,
      textAlign: 'center',
      ...padding(5, 0),
    },
    lineQuantityReached: {
      backgroundColor: COLOR_INFO,
    },
    lineExpectedQuantity: {
      width: 45,
      color: 'white',
      backgroundColor: COLOR_PRIMARY,
      textAlign: 'center',
      ...padding(5, 0),
    },
    toggleList: {
      paddingVertical: 5,
      justifyContent: 'center',
      alignItems: 'center',
      height: 38,
    },
    toggleListIcon: {
      fontSize: 14,
      color: 'white',
    },
    open: {
      list: {
        flex: 1,
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
      },
    },
  };

  constructor(props) {
    super(props);

    this.scan = null;
    this.containerRepository = get('container_repository');
    this.articleRepository = get('article_repository');
    this.validator = get('validator');
    this.analytics = get('firebase-analytics');

    this.state = {
      listOpen: false,
    };

    this.onCode = this.onCode.bind(this);
    this.searchContainer = this.searchContainer.bind(this);
    this.addContainer = this.addContainer.bind(this);
    this.openContainer = this.openContainer.bind(this);
    this.removeContainer = this.removeContainer.bind(this);
    this.addContainerManually = this.addContainerManually.bind(this);
    this.getContainersCount = this.getContainersCount.bind(this);
    this.isComplete = this.isComplete.bind(this);
    this.getScannedContainersCount = this.getScannedContainersCount.bind(this);
    this.getRemainingContainersCount = this.getRemainingContainersCount.bind(this);
    this.findNextLineNumberForContainer = this.findNextLineNumberForContainer.bind(this);
    this.sortedArianeOperationLines = this.sortedArianeOperationLines.bind(this);
    this.getScannedContainersForLine = this.getScannedContainersForLine.bind(this);
    this.confirm = this.confirm.bind(this);
    this.toggleList = this.toggleList.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  componentWillUnmount() {
    this.props.cancelContainers();
  }

  /**
   * Catch the camera result on code detection
   *
   * @param {String} code
   */
  onCode(code) {
    if (!this.props.isFocused || this.state.listOpen) {
      return;
    }

    this.analytics.logEvent('container_batch_scan');
    this.searchContainer(code);
  }

  /**
   * Confirm selected containers
   */
  confirm() {
    const { shippingContainers, next } = this.props;

    this.props.confirmContainers(shippingContainers);
    next();
  }

  /**
   * Open / close the list of containers
   */
  toggleList() {
    this.setState({ listOpen: !this.state.listOpen });
  }

  /**
   * Search container in DB by barcode and redirect the appropriate scene
   *
   * @param {String} barcode
   */
  searchContainer(barcode) {
    const { next, shippingContainers } = this.props;
    const { error, success, info } = Scan.styles.flash;
    const flash = color => {
      this.scan.flash(color);
      Vibration.vibrate();
    };

    // If the barcode was already scanned and a container added:
    if (shippingContainers.find(container => container.barcode === barcode)) {
      // Inform the user:
      RNAlert.alert(
        I18n.t('scenes.shipping.batch_scan_ariane_operation.alert.already_scanned.title'),
        I18n.t('scenes.shipping.batch_scan_ariane_operation.alert.already_scanned.content', { barcode }),
        [{ text: 'OK', style: 'cancel' }],
      );
      flash(info);

      return;
    }

    const containers = this.containerRepository.search(barcode);

    if (containers.length) {
      if (containers.length > 1) {
        // Multiple matches, ask which one to use:
        navigate(PIPE_SELECT_CONTAINER, { barcode, next, onSelectedContainer: this.addContainer });

        return;
      }

      this.addContainer(containers[0]);
      flash(success);

      return;
    }

    // Unknown container for this barcode:
    RNAlert.alert(
      I18n.t('scenes.shipping.batch_scan_ariane_operation.alert.unknown_container_barcode.title'),
      I18n.t('scenes.shipping.batch_scan_ariane_operation.alert.unknown_container_barcode.content', { barcode }),
      [{ text: 'OK', style: 'cancel' }],
    );
    flash(error);
  }

  /**
   * @param {Container} container
   */
  addContainer(container) {
    const { barcode } = container;
    const lineNumber = this.findNextLineNumberForContainer(container);
    this.validator.validate(
      [this.validator.isShippingValid(container), this.validator.isValidOperationLineNumber(lineNumber, barcode)],
      () => this.props.addShippingContainer(container, lineNumber),
    );
  }

  addContainerManually() {
    const { next } = this.props;

    navigate(PIPE_SEARCH_CONTAINER, { next, onSelectedContainer: this.addContainer });
  }

  /**
   * @param {Container} container
   */
  openContainer(container) {
    if (!this.state.listOpen) {
      this.toggleList();

      return;
    }

    const { next } = this.props;

    navigate(PIPE_CONTAINER_INFOS, { next, barcode: container.barcode });
  }

  /**
   * @param {Container} container
   */
  removeContainer(container) {
    if (!this.state.listOpen) {
      return this.toggleList();
    }

    this.props.removeShippingContainer(container);
  }

  /**
   * @param {Number} lineNumber
   *
   * @returns {String[]} Containers uuids
   */
  getScannedContainersForLine(lineNumber) {
    return Object.entries(this.props.arianeOperationLineNumbers)
      .filter(([, ln]) => ln === lineNumber)
      .map(([containerUuid]) => containerUuid);
  }

  /**
   * @returns {Number}
   */
  getContainersCount() {
    return this.props.arianeOperation.lines.reduce((count, line) => (count += line.quantity), 0);
  }

  /**
   * @returns {Number}
   */
  getScannedContainersCount() {
    return this.props.shippingContainers.length;
  }

  /**
   * @returns {Number}
   */
  getRemainingContainersCount() {
    return this.getContainersCount() - this.getScannedContainersCount();
  }

  /**
   * @param {Container} container
   *
   * @return {Number} The next line number for a newly scanned/added container.
   *                  -1 if none of the lines are available/matches container's article (nor ifEmptyArticle).
   */
  findNextLineNumberForContainer(container) {
    const lines = this.sortedArianeOperationLines();
    const findMatchingLine = article =>
      lines.find(
        line =>
          line.articleExternalId === article.externalId &&
          this.getScannedContainersForLine(line.lineNumber).length < line.quantity,
      );

    let matchingOperationLine = findMatchingLine(container.article);

    // If container's article does not match an operation line, check for ifEmptyArticle as well:
    if (!matchingOperationLine && container.article.articleIfEmpty) {
      matchingOperationLine = findMatchingLine(container.article.articleIfEmpty);
    }

    return matchingOperationLine ? matchingOperationLine.lineNumber : -1;
  }

  sortedArianeOperationLines() {
    return this.props.arianeOperation.lines.sort((a, b) => Math.sign(a.lineNumber - b.lineNumber));
  }

  isComplete() {
    return this.getScannedContainersCount() === this.getContainersCount();
  }

  /**
   * @param {Object} item Ariane operation line
   */
  renderItem({ item, index }) {
    const { styles } = this.constructor;

    const article = this.articleRepository.findInMyHierarchyByExternalId(item.articleExternalId);
    const containersForLine = this.getScannedContainersForLine(item.lineNumber);
    const quantityReached = item.quantity === containersForLine.length;

    return (
      <View style={styles.listItem} key={index}>
        <Text ellipsizeMode="tail" style={styles.lineDesignation}>
          {article.designation}
        </Text>
        <Text style={{ ...styles.lineQuantity, ...(quantityReached ? styles.lineQuantityReached : {}) }}>
          {this.getScannedContainersForLine(item.lineNumber).length}
        </Text>
        <Text style={styles.lineExpectedQuantity}>{item.quantity}</Text>
      </View>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { listOpen } = this.state;
    const { isFocused, arianeOperation } = this.props;

    return (
      <WrapperView full style={styles.wrapper}>
        <Scan
          style={styles.scan}
          onCode={this.onCode}
          active={isFocused}
          ref={scan => {
            this.scan = scan;
          }}
        >
          <View>
            <Text styleName="title" style={styles.title}>
              {I18n.t('scenes.shipping.batch_scan_ariane_operation.title', {
                number: arianeOperation.number,
              })}
            </Text>
            <Text subtitle="title" style={styles.subtitle}>
              {I18n.t('scenes.shipping.batch_scan_ariane_operation.subtitle', {
                count: this.getRemainingContainersCount(),
              })}
            </Text>
          </View>
          <View style={listOpen ? styles.open.list : styles.list}>
            <TouchableOpacity style={styles.toggleList} onPress={this.toggleList}>
              <Icon
                style={{ ...styles.containerDetails, ...styles.toggleListIcon }}
                name={listOpen ? 'chevron-down' : 'chevron-up'}
              />
            </TouchableOpacity>
            <FlatList
              data={this.sortedArianeOperationLines()}
              renderItem={this.renderItem}
              keyExtractor={item => `${item.lineNumber}`}
            />
          </View>
        </Scan>
        <View styleName="horizontal">
          <Button style={styles.validate} onPress={this.confirm} valid={this.isComplete()}>
            {I18n.t('common.next')}
          </Button>
          <Button style={styles.manual} onPress={this.addContainerManually} valid={!this.isComplete()}>
            <Text style={styles.manualText}>+</Text>
          </Button>
        </View>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    shippingContainers: state.shippingReducer.shippingContainers,
    arianeOperationLineNumbers: state.shippingReducer.arianeOperationLineNumbers,
    arianeOperation: state.shippingReducer.arianeOperation,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    addShippingContainer: (container, lineNumber) => dispatch(addShippingContainer(container, lineNumber)),
    removeShippingContainer: container => dispatch(removeShippingContainer(container)),
    confirmContainers: containers => dispatch(confirmContainersToShip(containers)),
    cancelContainers: () => dispatch(cancelContainersToShip()),
  }),
)(withNavigationFocus(BatchScanArianeOperationContainers));
