import React, { Component } from 'react';
import PropTypes, { instanceOf, oneOfType } from 'prop-types';
import Intervention from 'k2/app/modules/intervention/models/Intervention';
import InterventionPlanned from 'k2/app/modules/intervention/models/InterventionPlanned';
import { get } from 'k2/app/container';
import View from 'k2/app/modules/common/components/View';
import IconBadge from 'k2/app/modules/common/components/IconBadge';
import { Image, Text } from 'react-native';
import InterventionType from 'k2/app/modules/intervention/models/InterventionType';
import I18n from 'i18n-js';
import moment from 'moment';
import { COLOR_ERROR } from '../../common/styles/vars';

const isOutdated = date => {
  return new Date(date) < new Date();
};

/**
 * A single intervention row for listings
 */
export default class InterventionRow extends Component {
  static propTypes = {
    intervention: oneOfType([instanceOf(Intervention), instanceOf(InterventionPlanned)]).isRequired,
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
    intervention: {
      type: {
        fontSize: 8,
        textAlign: 'center',
      },
      date: {
        fontSize: 10,
        flex: 0,
      },
      outdated: {
        color: COLOR_ERROR,
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
  }

  render() {
    const { styles } = this.constructor;
    const { intervention } = this.props;
    const { type, creation, performedAt, synced, plannedAt } = intervention;
    const installation = this.installationRepository.find(intervention.installation);
    return (
      <View styleName="horizontal" style={styles.row}>
        <View style={styles.left}>
          <IconBadge active={!synced} style={styles.unsynced}>
            <Image style={styles.icon} source={InterventionType.icons[type]} />
          </IconBadge>
          <Text style={styles.intervention.type} ellipsizeMode="tail" numberOfLines={1}>
            {I18n.t(InterventionType.readableFor(type))}
          </Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.intervention.site} ellipsizeMode="tail" numberOfLines={1}>
            {installation?.site.name}
          </Text>
          <Text style={styles.intervention.client} ellipsizeMode="tail" numberOfLines={1}>
            {installation?.site.client.name}
          </Text>
        </View>
        <View style={styles.right}>
          {performedAt || creation ? (
            <Text style={styles.intervention.date}>
              {moment(performedAt ?? creation).format(I18n.t(this.props.dateFormat))}
            </Text>
          ) : null}
          {plannedAt ? (
            <Text style={[styles.intervention.date, isOutdated(plannedAt) ? styles.intervention.outdated : null]}>
              {moment(plannedAt).format(I18n.t(this.props.dateFormat))}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }
}
