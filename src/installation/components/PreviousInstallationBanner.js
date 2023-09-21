import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'k2/app/modules/common/components/Icon';
import Fieldset from '../../common/components/Fieldset';
import Installation from '../models/Installation';
import { COLOR_SECONDARY } from '../../common/styles/vars';
import { throttle } from '../../common/utils/NavigationUtils';

class PreviousInstallationBanner extends Component {
  static propTypes = {
    installation: PropTypes.instanceOf(Installation).isRequired,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.shape(),
  };

  static defaultProps = {
    installation: null,
    style: {},
  };

  static styles = {
    touch: {
      flexDirection: 'row',
      paddingLeft: 10,
      paddingRight: 10,
      paddingBottom: 10,
      alignItems: 'center',
    },
    text: {
      flex: 1,
      fontSize: 12,
      color: COLOR_SECONDARY,
    },
  };

  render() {
    const { styles } = this.constructor;
    const { installation, onPress, style } = this.props;
    const { site, name, reference, barcode } = installation;

    return (
      <View style={style}>
        <Fieldset title={I18n.t('previous_installation.title')}>
          <TouchableOpacity style={styles.touch} onPress={throttle(onPress)}>
            <Text style={styles.text}>
              {I18n.t('previous_installation.description', {
                installation: name || reference || barcode,
                site: site.name,
                city: site.city,
                client: site.client.name,
              })}
            </Text>
            <Icon name="chevron-right" />
          </TouchableOpacity>
        </Fieldset>
      </View>
    );
  }
}

export default PreviousInstallationBanner;
