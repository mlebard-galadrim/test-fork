import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import I18n from 'i18n-js';
import { withNavigationFocus } from 'react-navigation';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import { FlatList, TouchableHighlight, TouchableOpacity, Vibration } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import View from 'k2/app/modules/common/components/View';
import Icon from 'k2/app/modules/common/components/Icon';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import Scan from 'k2/app/modules/common/components/Scan';
import { Button } from 'k2/app/modules/common/components/form';
import { GUTTER } from 'k2/app/modules/common/styles/vars';
import { margin, padding } from 'k2/app/modules/common/styles/utils';
import Container from '../models/Container';
import ContainerIcon from '../components/ContainerIcon';
import { PIPE_SEARCH_CONTAINER, PIPE_SELECT_CONTAINER, PIPE_CONTAINER_INFOS } from '../constants';
import {
  addShippingContainer,
  cancelContainersToShip,
  confirmContainersToShip,
  removeShippingContainer,
} from 'k2/app/modules/shipping/actions/shippingPipe';

/**
 * Batch Scan Container for shippings
 */
class BatchScanContainer extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
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
    list: {
      flex: 0,
      flexBasis: 100,
    },
    listItem: {
      flex: 1,
      flexDirection: 'row',
      ...margin(GUTTER / 2, 0),
    },
    containerLabel: {
      flex: 1,
      padding: 0,
    },
    containerAction: {
      flex: 0,
      justifyContent: 'center',
      alignItems: 'center',
      ...padding(0, GUTTER),
    },
    containerIcon: {
      flex: 0,
      paddingLeft: GUTTER,
      paddingRight: GUTTER / 2,
      justifyContent: 'center',
    },
    containerTitle: {
      color: 'white',
    },
    containerDetails: {
      color: '#ccc',
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
    const { next } = this.props;
    const containers = this.containerRepository.search(barcode);
    const { error, success } = Scan.styles.flash;
    let flashColor = error;

    if (containers.length) {
      if (containers.length > 1) {
        navigate(PIPE_SELECT_CONTAINER, { barcode, next, onSelectedContainer: this.addContainer });

        return;
      }

      this.addContainer(containers[0]);
      flashColor = success;
    }

    this.scan.flash(flashColor);

    Vibration.vibrate();
  }

  /**
   * @param {Container} container
   */
  addContainer(container) {
    this.validator.validate(this.validator.isShippingValid(container), () =>
      this.props.addShippingContainer(container),
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
   * @param {Object} data
   */
  renderItem(data) {
    const { styles } = this.constructor;
    const container = data.item;
    const { barcode, article, competitor } = container;

    return (
      <TouchableHighlight style={styles.containerAction} onPress={() => this.openContainer(container)}>
        <View style={styles.listItem} key={`container-${barcode}`}>
          <View style={styles.containerIcon}>
            <ContainerIcon container={container} />
          </View>
          <View style={styles.containerLabel}>
            <Text ellipsizeMode="tail" numberOfLines={1} style={styles.containerTitle}>
              {article.designation}
            </Text>
            <Text styleName="caption" ellipsizeMode="tail" numberOfLines={1} style={styles.containerDetails}>
              {competitor ? competitor.designation : 'Climalife'} {barcode}
            </Text>
          </View>
          <TouchableHighlight style={styles.containerAction} onPress={() => this.removeContainer(container)}>
            <Icon style={styles.containerDetails} name="times" />
          </TouchableHighlight>
        </View>
      </TouchableHighlight>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { listOpen } = this.state;
    const { shippingContainers, isFocused } = this.props;

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
          <Text styleName="title" style={styles.title}>
            {I18n.t('scenes.container.batch_scan.title', {
              count: shippingContainers.length,
            })}
          </Text>
          <View style={listOpen ? styles.open.list : styles.list}>
            <TouchableOpacity style={styles.toggleList} onPress={this.toggleList}>
              <Icon
                style={{ ...styles.containerDetails, ...styles.toggleListIcon }}
                name={listOpen ? 'chevron-down' : 'chevron-up'}
              />
            </TouchableOpacity>
            <FlatList data={shippingContainers} renderItem={this.renderItem} />
          </View>
        </Scan>
        <View styleName="horizontal">
          <Button style={styles.validate} onPress={this.confirm}>
            {I18n.t('common.next')}
          </Button>
          <Button style={styles.manual} onPress={this.addContainerManually}>
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
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    addShippingContainer: container => dispatch(addShippingContainer(container)),
    removeShippingContainer: container => dispatch(removeShippingContainer(container)),
    confirmContainers: containers => dispatch(confirmContainersToShip(containers)),
    cancelContainers: () => dispatch(cancelContainersToShip()),
  }),
)(withNavigationFocus(BatchScanContainer));
