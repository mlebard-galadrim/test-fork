import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import View from 'k2/app/modules/common/components/View';
import { get } from 'k2/app/container';
import ContainerRepository from '../../container/repositories/ContainerRepository';
import ContainerIcon from '../../container/components/ContainerIcon';
import MainListView from '../../common/components/list/MainListView';

class ContainerShippingList extends Component {
  static propTypes = {
    containerIdentifiers: PropTypes.arrayOf(PropTypes.string).isRequired,
    containerRepository: PropTypes.instanceOf(ContainerRepository),
    style: PropTypes.shape(),
  };

  static defaultProps = {
    style: {},
    containerRepository: get('container_repository'),
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
  };

  constructor(props) {
    super(props);

    this.renderRow = this.renderRow.bind(this);
  }

  /**
   * @param {String} uuid
   *
   * @return {View}
   */
  renderRow(uuid) {
    const { styles } = ContainerShippingList;
    const { containerRepository } = this.props;
    const container = containerRepository.find(uuid);
    const { barcode, article, competitor } = container;

    return (
      <View styleName="horizontal" style={styles.wrapper} key={`container-${uuid}`}>
        <ContainerIcon container={container} />
        <View style={styles.label}>
          <Text style={styles.article} ellipsizeMode="tail" numberOfLines={1}>
            {article.designation}
          </Text>
          <Text style={styles.brand} ellipsizeMode="tail" numberOfLines={1}>
            {competitor ? competitor.designation : 'Climalife'} {barcode}
          </Text>
        </View>
      </View>
    );
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { containerIdentifiers, style } = this.props;

    return <MainListView data={containerIdentifiers} renderContent={this.renderRow} style={style} icon="" />;
  }
}

export default ContainerShippingList;
