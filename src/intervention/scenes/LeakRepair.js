import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Image } from 'react-native';
import Text from 'k2/app/modules/common/components/Text';
import View from 'k2/app/modules/common/components/View';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { Button } from 'k2/app/modules/common/components/form';
import { GUTTER, COLOR_ERROR, COLOR_SUCCESS } from 'k2/app/modules/common/styles/vars';
import MainListView from 'k2/app/modules/common/components/list/MainListView';
import { iconLeak } from 'k2/app/assets/icons';
import { setRepairedLeaks } from '../actions/interventionPipe';
import { PIPE_LEAK_REPAIR_SUMUP } from '../constants';

/**
 * Select repaired leaks
 */
class LeakRepair extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    setRepairedLeaks: PropTypes.func.isRequired,
    installationId: PropTypes.string.isRequired,
  };

  static styles = {
    list: {
      flex: 1,
    },
    submitButton: {
      flex: 0,
      borderRadius: 0,
    },
    leaks: {
      row: {
        justifyContent: 'center',
        alignItems: 'center',
      },
      label: {
        flex: 1,
      },
      input: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
      },
      switch: {
        marginLeft: GUTTER,
      },
      icon: {
        flex: 0,
        color: COLOR_SUCCESS,
      },
      image: {
        flex: 0,
        padding: 0,
        margin: 0,
        width: 24,
        height: 24,
      },
      nature: {
        marginRight: GUTTER / 2,
      },
    },
  };

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.installationRepository = get('installation_repository');
    this.componentRepository = get('component_repository');
    this.state = {
      installation: this.installationRepository.find(props.installationId),
      repairedLeaks: [],
    };
  }

  componentDidUpdate(prevProps) {
    const { installationId } = this.props;

    if (installationId !== prevProps.installationId) {
      this.setState({
        installation: this.installationRepository.find(installationId),
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.installationId !== null;
  }

  componentWillUnmount() {
    this.props.setRepairedLeaks([]);
  }

  onSubmit() {
    const { next } = this.props;

    this.props.setRepairedLeaks(this.state.repairedLeaks);
    navigate(PIPE_LEAK_REPAIR_SUMUP, { next });
  }

  isFormValid() {
    return this.state.repairedLeaks.length > 0;
  }

  toggleLeak(leak, value) {
    const repairedLeaks = this.state.repairedLeaks.slice(0);
    const index = repairedLeaks.indexOf(leak.uuid);

    if (value) {
      if (index < 0) {
        repairedLeaks.push(leak.uuid);
      }
    } else if (index >= 0) {
      repairedLeaks.splice(index, 1);
    }

    this.setState({ repairedLeaks });
  }

  renderRow(leak) {
    const { leaks: styles } = this.constructor.styles;
    const repaired = this.state.repairedLeaks.indexOf(leak.uuid) >= 0;

    return (
      <View styleName="horizontal" style={styles.row} key={`component-${leak.uuid}`}>
        <View style={styles.label}>
          {this.renderComponent(leak)}
          <Text ellipsizeMode="tail" numberOfLines={1}>
            {leak.location}
          </Text>
        </View>
        <View styleName="horizontal" style={styles.input}>
          {repaired ? (
            <Icon size={24} name="check" style={styles.icon} />
          ) : (
            <Image style={styles.image} source={iconLeak} />
          )}
          <Switch
            style={styles.switch}
            value={repaired}
            trackColor={COLOR_ERROR}
            onValueChange={value => this.toggleLeak(leak, value)}
          />
        </View>
      </View>
    );
  }

  /**
   * @param {Leak} leak
   *
   * @return {String}
   */
  renderComponent(leak) {
    const component = leak.componentUuid ? this.componentRepository.find(leak.componentUuid) : null;

    if (!component) {
      return <Text>{I18n.t('components.intervention.leak_list.out_of_component')}</Text>;
    }

    const { nature, mark, barcode } = component;

    return (
      <View styleName="horizontal">
        <Text style={LeakRepair.styles.leaks.nature}>{nature.designation.toString()}</Text>
        <Text styleName="caption">{mark || barcode}</Text>
      </View>
    );
  }

  render() {
    const { styles } = this.constructor;
    const { installation } = this.state;

    return (
      <WrapperView full title={I18n.t('scenes.intervention.leak_repair.title')} subtitle={installation.name}>
        <MainListView
          style={styles.list}
          data={Array.from(installation.leaks)}
          renderContent={this.renderRow}
          icon={null}
          noDataContent="scenes.intervention.leak_repair.list:empty"
        />
        <Button style={styles.submitButton} onPress={this.onSubmit} valid={this.isFormValid()}>
          {I18n.t('common.submit')}
        </Button>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    installationId: state.interventionPipe.intervention.installation,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    setRepairedLeaks: leaks => dispatch(setRepairedLeaks(leaks)),
  }),
)(LeakRepair);
