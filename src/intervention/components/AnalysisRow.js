import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'k2/app/container';
import View from 'k2/app/modules/common/components/View';
import IconBadge from 'k2/app/modules/common/components/IconBadge';
import { Image, Text } from 'react-native';
import I18n from 'i18n-js';
import moment from 'moment';
import AnalysisNature from '../../analysis/models/AnalysisNature';
import Analysis from '../../analysis/models/Analysis';

/**
 * A single intervention row for listings
 */
export default class AnalysisRow extends Component {
  static propTypes = {
    analysis: PropTypes.instanceOf(Analysis).isRequired,
    dateFormat: PropTypes.string,
  };

  static defaultProps = {
    dateFormat: 'date.formats.moment_datepicker',
  };

  static styles = {
    row: {
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    left: {
      flex: 0,
      flexBasis: 45,
      margin: 0,
      padding: 0,
      marginRight: 5,
      alignItems: 'center',
    },
    content: {
      flex: 1,
    },
    right: {
      flex: 0,
    },
    icon: {
      width: 36,
      height: 27,
      margin: 0,
      padding: 0,
    },
    analysis: {
      type: {
        fontSize: 8,
        textAlign: 'center',
      },
      date: {
        fontSize: 10,
        flex: 0,
      },
      site: {},
      client: {},
    },
    unsynced: {
      wrapper: {},
      label: {},
      badge: {
        top: 0,
        left: 0,
      },
    },
  };

  constructor(props) {
    super(props);

    this.installationRepository = get('installation_repository');
    this.analysisTypeRepository = get('analysis_type_repository');
  }

  render() {
    const { styles } = this.constructor;
    const { analysis } = this.props;
    const { creation, synced } = analysis;
    const type = this.analysisTypeRepository.find(analysis.type);
    const { nature } = type;
    const installation = this.installationRepository.find(analysis.installationUuid);
    return (
      <View styleName="horizontal" style={styles.row}>
        <View style={styles.left}>
          <IconBadge active={!synced} style={styles.unsynced}>
            <Image style={styles.icon} source={AnalysisNature.icons[nature]} />
          </IconBadge>
          <Text style={styles.analysis.type} ellipsizeMode="tail" numberOfLines={1}>
            {I18n.t(AnalysisNature.readableFor(nature))}
          </Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.analysis.site} ellipsizeMode="tail" numberOfLines={1}>
            {installation?.site.name}
          </Text>
          <Text style={styles.analysis.client} ellipsizeMode="tail" numberOfLines={1}>
            {installation?.site.client.name}
          </Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.analysis.date}>{moment(creation).format(I18n.t(this.props.dateFormat))}</Text>
        </View>
      </View>
    );
  }
}
