import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from 'i18n-js';
import { get } from 'k2/app/container';
import Text from 'k2/app/modules/common/components/Text';
import View from 'k2/app/modules/common/components/View';
import ContainerLoad from '../models/ContainerLoad';
import ContainerRepository from '../../container/repositories/ContainerRepository';
import InstallationRepository from '../../installation/repositories/InstallationRepository';
import ContainerIcon from '../../container/components/ContainerIcon';
import MainListView from '../../common/components/list/MainListView';
import { fixed } from '../../common/utils/filterUtils';

class ContainerLoadList extends Component {
  static propTypes = {
    containerLoads: PropTypes.arrayOf(PropTypes.instanceOf(ContainerLoad)).isRequired,
    containerRepository: PropTypes.instanceOf(ContainerRepository),
    installationRepository: PropTypes.instanceOf(InstallationRepository),
    installation: PropTypes.string,
    loading: PropTypes.bool.isRequired,
    style: PropTypes.shape(),
    title: PropTypes.string,
  };

  static defaultProps = {
    style: {},
    title: 'scenes.intervention.drainage_filling_shunt.list_containers:title',
    installation: null,
    containerRepository: get('container_repository'),
    installationRepository: get('installation_repository'),
  };

  static styles = {
    wrapper: {
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    load: {
      flex: 0,
      flexBasis: 80,
      fontSize: 18,
      textAlign: 'center',
      paddingRight: 10,
    },
    label: {
      flex: 1,
    },
    article: {
      textAlign: 'left',
    },
    brand: {
      textAlign: 'left',
    },
    title: {
      textAlign: 'center',
      marginBottom: 10,
    },
  };

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return !nextProps.containerLoads.some(containerLoad => containerLoad.isEmpty());
  }

  /**
   * @param {ContainerLoad} containerLoad
   *
   * @return {View}
   */
  renderRow(containerLoad) {
    const { styles } = ContainerLoadList;
    const { containerRepository, installationRepository, installation, loading } = this.props;
    const { containerUuid, barcode, load, recycled, forElimination } = containerLoad;
    const container = containerRepository.find(containerUuid);

    return (
      <View styleName="horizontal" style={styles.wrapper} key={`container-${barcode}`}>
        <ContainerIcon
          container={container}
          fluid={installationRepository.find(installation).primaryCircuit.fluid}
          recycled={recycled}
          forElimination={forElimination}
          load={load * (loading ? -1 : 1)}
        />
        <Text style={styles.load} ellipsizeMode="tail" numberOfLines={1}>
          {fixed(load)} kg
        </Text>
        <View style={styles.label}>
          <Text style={styles.article} ellipsizeMode="tail" numberOfLines={1}>
            {container.article.designation}
          </Text>
          <Text style={styles.brand} ellipsizeMode="tail" numberOfLines={1}>
            {container.competitor ? container.competitor.designation : 'Climalife'} - {barcode}
          </Text>
        </View>
      </View>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { containerLoads, style, title } = this.props;
    const { styles } = ContainerLoadList;

    return (
      <View style={style}>
        {title && (
          <Text testID="title" styleName="title" style={styles.title}>
            {I18n.t(title)}
          </Text>
        )}
        <MainListView
          data={containerLoads}
          renderContent={this.renderRow}
          keyExtractor={containerLoad => containerLoad.containerUuid}
          icon=""
        />
      </View>
    );
  }
}

export default ContainerLoadList;
