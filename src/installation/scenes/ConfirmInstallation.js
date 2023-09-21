import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import WrapperView from '../../common/components/WrapperView';
import MainListView from '../../common/components/list/MainListView';
import Definition from '../../common/components/Definition';
import { Button } from '../../common/components/form';
import InstallationFilter from '../filters/InstallationFilter';
import { selectInstallation } from '../actions/installationPipe';
import { PIPE_CLIENT_SELECTION } from '../constants';

/**
 * Confirm scanned installation scene
 */
class ConfirmInstallation extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    selectInstallation: PropTypes.func.isRequired,
    reference: PropTypes.string.isRequired,
    filter: PropTypes.oneOf(InstallationFilter.values),
  };

  static defaultProps = {
    reference: '',
    filter: null,
  };

  static styles = {
    name: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
      marginRight: 0,
      paddingRight: 0,
      maxWidth: 260,
    },
    reference: {
      fontSize: 12,
    },
    button: {
      marginTop: 20,
    },
  };

  constructor(props) {
    super(props);

    const { reference, filter } = props;

    this.validator = get('validator');
    this.state = {
      installationsList: Array.from(get('installation_repository').findByBarcodeWithFilter(reference, filter)),
    };

    this.confirm = this.confirm.bind(this);
    this.renderInstallation = this.renderInstallation.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  componentWillUnmount() {
    this.props.selectInstallation(null);
  }

  /**
   * Dispatch the selected installation to the current intervention store
   *
   * @param {Installation} installation
   */
  confirm(installation) {
    const { next } = this.props;

    this.validator.validate(this.validator.isInstallationValid(installation), () => {
      this.props.selectInstallation(installation);
      next();
    });
  }

  /**
   * @param {Installation} installation
   */
  renderInstallation(installation) {
    const { styles } = this.constructor;

    return (
      <View>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.name}>
          {installation.name}
        </Text>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.reference}>
          {installation.reference}
        </Text>
        <Text ellipsizeMode="tail" numberOfLines={1}>
          {installation.site.name}
        </Text>
      </View>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { installationsList } = this.state;

    if (installationsList.length > 1) {
      const title = I18n.t('scenes.installation.installation.confirm.many_results.title', {
        length: installationsList.length,
      });

      return (
        <WrapperView full title={title}>
          <MainListView
            data={installationsList}
            onPressItem={this.confirm}
            getSectionId={installation => installation.site.client.name}
            isDisabled={installation => installation.leaking}
            renderContent={this.renderInstallation}
          />
        </WrapperView>
      );
    }

    if (installationsList.length === 1) {
      const installation = installationsList[0];
      const transLabel = property => I18n.t(`scenes.installation.installation.confirm.single_result.${property}`);

      return (
        <WrapperView title={transLabel('title')}>
          <Definition key="name" label={transLabel('name')} value={installation.name} />
          <Definition key="reference" label={transLabel('reference')} value={installation.reference} />
          <Definition key="site_name" label={transLabel('site_name')} value={installation.site.name} />
          <Definition key="client_name" label={transLabel('client_name')} value={installation.site.client.name} />
          <Button style={styles.button} onPress={() => this.confirm(installation)}>
            <Text>{transLabel('next')}</Text>
          </Button>
        </WrapperView>
      );
    }

    return (
      <WrapperView title={I18n.t('scenes.installation.installation.confirm.no_result.text')}>
        <Button style={styles.button} onPress={() => navigate(PIPE_CLIENT_SELECTION)}>
          <Text>{I18n.t('scenes.installation.installation.confirm.no_result.text_back')}</Text>
        </Button>
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    reference: props.navigation.getParam('reference'),
    next: props.navigation.getParam('next'),
    filter: props.navigation.getParam('filter'),
  }),
  dispatch => ({
    selectInstallation: installation => dispatch(selectInstallation(installation)),
  }),
)(ConfirmInstallation);
